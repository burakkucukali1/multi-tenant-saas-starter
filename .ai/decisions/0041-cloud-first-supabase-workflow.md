# ADR-0041: Cloud-First Supabase Workflow

- Status: Accepted
- Date: 2026-09-28
- Accepted: 2026-09-28 (owner approved cloud-first workflow)
- Approval level: L3
- Supersedes: ADR-0033
- Related: ADR-0007, ADR-0009, ADR-0018, ADR-0025, ADR-0026, ADR-0036

## Context

Owner constraint: development uses **Supabase Cloud (Free tier)**. Docker-based local Supabase is not the primary workflow.

Requirements:

- Every schema change is a source-controlled migration.
- The dashboard is never the source of truth.
- Environment drift between development and production is minimized.

Constraints this creates:

- Every environment is internet-reachable from its first minute.
- The Free tier limits how many active projects exist.
- Free projects pause when inactive, and have no automated backups.
- Some Supabase CLI commands need Docker for a local shadow database: `db diff` and `db pull`, and possibly `db dump` and `test db`.
- `.ai/integrations/supabase.md` requires separate development, staging, and production environments that are never shared.

## Decision

### 1. Environment Strategy

| Environment | Supabase project | Tier            | Clerk                    | Stripe    | Data                |
| ----------- | ---------------- | --------------- | ------------------------ | --------- | ------------------- |
| Development | `<app>-dev`      | Free            | Development instance     | Test mode | Synthetic seed only |
| CI          | `<app>-ci`       | Free            | Development instance     | Test mode | Reset every run     |
| Staging     | `<app>-staging`  | Paid (ADR-0036) | Production-like instance | Test mode | Synthetic           |
| Production  | `<app>-prod`     | Paid (ADR-0036) | Production instance      | Live mode | Real                |

- The two Free projects are development and CI. They are **never shared** with each other, and never used for production or staging.
- Staging and production are created before launch, on a paid tier (ADR-0036). There is no production to stage for before then, so no staging exists during early development.
- Parity rules for all projects:
  - same region
  - same Postgres major version
  - same pinned Supabase CLI version
  - same migrations
  - same config-as-code
- Real personal data never enters development or CI.

#### Dev vs CI: Why Two Free Projects

| Concern                | Development (`<app>-dev`)                                        | CI (`<app>-ci`)                                                      |
| ---------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| Purpose                | Human authoring: push migrations, manual testing, local app runs | Automated gate: reset, migrate, seed, tests, type diff, drift checks |
| Lifetime of data       | Persists between sessions until reset                            | Destroyed and rebuilt at the start of each CI run                    |
| Who writes schema      | Developers via `db push` on feature branches                     | CI only, from the pull request branch                                |
| Failure mode if shared | CI reset wipes in-progress developer work                        | N/A                                                                  |

**Tradeoff accepted:** the Free tier allows only two active projects during early development, so dev and CI consume both slots. Staging and production wait for a paid tier (ADR-0036). **Tradeoff rejected:** one project for dev and CI. That would violate “never share environments” (integration guide and ADR-0041) and make every CI run destructive to developer state.

**Team scaling:** one dev project implies serialized schema work, or reset discipline before each schema branch. Larger teams add paid dev projects or Supabase branching later without changing the migration source of truth.

### 2. Migration Workflow

The source of truth is `supabase/migrations/*.sql`, applied in timestamp order and tracked in `supabase_migrations.schema_migrations`.

Authoring loop:

1. Reset development from `main` before starting a branch that changes the schema.
2. Run `supabase migration new <name>` and write the SQL by hand. There is no `db diff` in this workflow: it needs Docker, and hand-written SQL reviews better.
3. Push to development with `supabase db push`, linked to the development project.
4. Regenerate types, then commit the migration and the types in the same pull request.
5. Until the pull request merges, a migration may be edited. Edit, reset development, and push again.
6. **Once merged to `main`, a migration is immutable.** Fixes are new forward migrations.

Migration rules:

- Every migration is transactional. Statements that cannot run in a transaction (for example `CREATE INDEX CONCURRENTLY`) go in their own migration file, with a comment explaining why.
- **Expand and contract.** Every migration must stay compatible with the application version currently deployed, because deploying the database and deploying the app are not atomic. Destructive changes (drop, rename, `NOT NULL` without a default) happen only in a later contract migration, after the app no longer depends on the old shape.
- The first migration is the lockdown from ADR-0007. It runs before any table exists, because cloud projects are publicly reachable.
- Extensions are enabled only through migrations.
- `supabase migration repair` rewrites history. It is Level 2 and requires explicit approval.
- Production and staging are migrated **only by CI**, never from a laptop.

### 3. Configuration as Code

Some settings are not SQL:

- Data API exposed schemas (`public`, `platform`)
- Supabase Auth disabled or sign-ups off
- Data API settings

How they are handled:

- These settings live in `supabase/config.toml` and are applied to remote projects with the CLI's config push command.
- Settings the CLI cannot push are listed in the environment runbook. A verification script reads each project's settings through the Supabase Management API and fails CI on any difference.
- Dashboard changes to schema or settings are prohibited. The dashboard is used read-only, except for incident response, which is followed by a migration or config change.

### 4. Generated Types Workflow

- The CLI is pinned as a dev dependency, so generator output is identical on every machine.
- The command is `supabase gen types typescript --project-id <project-ref> --schema public,platform`. It needs no Docker.
- The output is committed as `lib/db/types.generated.ts`. CI regenerates types and fails on any difference (`git diff --exit-code`).

#### Canonical type generation (CI as arbiter)

**Problem:** if committed types are generated from the development project, any leftover migration from an unmerged branch, a manual dashboard edit, or a forgotten reset makes types reflect **project state**, not **repository state**. That silently merges invalid schema into the codebase.

**Decision:**

1. **Canonical types** are generated only from the **CI project immediately after** that run has applied **only** migrations (and reference seed rules) from the checked-out commit. No dependency on development project state.
2. **Developers** may generate from development for local ergonomics while authoring. Those files are not authoritative until CI passes on the pull request.
3. **Pull requests** must include migration SQL and regenerated types in the same commit series. CI’s type diff is the merge gate.

**Rationale:** migrations are the schema source of truth (section 2). Types are a derived artifact. Deriving them from a disposable, reset CI project guarantees the artifact matches the migration chain under review. This aligns with ADR-0007 (generated types committed, CI drift check) without requiring Docker.

### 5. Seeding Strategy

Four classes, each with one mechanism:

| Class                      | Examples                                                                             | Mechanism                                                                                                                         | Environments                                   |
| -------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Reference data             | roles, permissions, role grants, entitlement keys, audit action keys, plan structure | **Idempotent inserts in migrations**, validated against the code registries in CI                                                 | All                                            |
| Environment config         | Stripe price mapping                                                                 | Plans carry a stable `lookup_key`. Stripe prices use the same lookup keys in every mode. No Stripe IDs are stored per environment | All                                            |
| Synthetic development data | sample workspaces and memberships                                                    | `supabase/seed.sql`, deterministic                                                                                                | Development, CI, staging. **Never production** |
| Test data                  | per-test workspaces                                                                  | Jest factories (ADR-0025)                                                                                                         | CI and development test runs                   |

- Bootstrap data for production (first platform admin, initial legal document versions) is created by audited operator scripts and platform admin actions, never by `seed.sql`.
- Seeded users need Clerk identities. A development seed script may create Clerk users through the Clerk Backend API, against the development instance only.

### 6. RLS Strategy (Cloud Implications)

The model stays as in ADR-0007: RLS on, no permissive policies, privileges revoked. The cloud environment makes it more urgent:

- The project URL and publishable key are effectively public, so the Data API is reachable from the internet in every environment, including development.
- Lockdown is migration one. CI runs the lockdown checks and the isolation suite (anon key path) against the CI project on every pull request.
- The default privileges that grant `anon` and `authenticated` access to new objects are revoked for the role that runs migrations, in both `public` and `platform`. CI verifies this against real catalog state, not by reading the SQL files.
- Supabase's database linter or security advisor output is checked in CI where it is available without Docker. Where it is not, the custom catalog checks in P2-T03 are authoritative.
- Server secrets use Supabase's secret API keys where the project supports them, because they can be revoked individually. Otherwise the legacy service role key is used. Keys differ per environment and are never reused across environments.

### 7. Drift Detection

`db diff` needs Docker, so drift is detected without it. Each **drift category** has one owner, one detection method, and one remediation.

| Category                    | What drift means                                                                                                                                                                    | Detection                                                                                                   | Remediation                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Migration history**       | Applied migration versions on a project differ from `supabase/migrations/` in git                                                                                                   | `supabase migration list` per linked project vs repository                                                  | Forward-only: add missing migrations via CI or `db push`; never edit applied history without Level 2 `migration repair` |
| **Schema fingerprint**      | Live DDL (tables, columns, constraints, indexes, RLS flags, policies, grants, function signatures) differs from the fingerprint produced by applying migrations to a clean CI build | Normalized `pg_catalog` query; compare dev and CI post-reset; compare staging/prod to CI golden fingerprint | Capture intent in a new migration; reset dev or rebuild CI; redeploy staging/prod only through CI                       |
| **Platform config**         | Data API exposed schemas, Auth settings, or other non-SQL settings differ from `config.toml` and runbook                                                                            | CLI config push dry-run where supported; Management API verification script in CI                           | Update `config.toml` or runbook; push config; document incident dashboard edits                                         |
| **Postgres engine version** | Major (or pinned minor) Postgres version differs across projects                                                                                                                    | Included in fingerprint metadata                                                                            | Align projects via Supabase upgrade before launch or before adding environments                                         |
| **Reference data**          | Seeded roles, permissions, or registry-backed rows differ from migrations plus code registries                                                                                      | Registry-vs-seed CI checks (ADR-0025)                                                                       | Fix migration seed inserts; reset non-production environments                                                           |

Scheduled jobs run categories **Migration history**, **Schema fingerprint**, and **Platform config** across all linked projects once staging and production exist.

### 8. Backup and Recovery

- **Development and CI:** no backups. **Both must be fully reconstructible** from migrations plus seed, so a reset is the recovery. That is a design requirement, not an accident.
- **Production:** backups require a paid tier, and so does point-in-time recovery for minute-level loss. Target recovery point and time are an owner decision (ADR-0036).
- Before every production migration, CI confirms a recent backup exists (on a paid tier). Migrations roll forward. There are no down migrations.
- **Cross-system consistency after a restore:**
  - Stripe: a manual reconciliation script re-syncs subscriptions from Stripe, which is the source of truth (ADR-0013).
  - Clerk: just-in-time provisioning re-creates missing users.
  - GDPR: restoring a backup can bring erased personal data back. An **erasure ledger** (subject IDs and erasure times only) is kept, and the restore procedure re-applies erasure for every ledger entry newer than the backup.
- A restore drill into a scratch project is part of P8.

### 9. CI/CD Implications

| Trigger                                                  | Job                                                                                                                                                      | Target      |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Pull request                                             | Reset CI project, push migrations, seed, generate types and diff, lockdown and catalog checks, fingerprint, integration, isolation, authorization matrix | CI project  |
| Merge to `main`                                          | Same checks, then migrate staging (once it exists)                                                                                                       | Staging     |
| Release (manual approval, GitHub Environment protection) | Fingerprint pre-check, backup check, `db push`, then app deploy                                                                                          | Production  |
| Manual dispatch                                          | Reset development to `main`                                                                                                                              | Development |
| Scheduled                                                | Drift check across all projects                                                                                                                          | All         |

- **Serialization:** all jobs that touch the CI project share one concurrency group, because parallel runs against a single CI project would corrupt each other. Tradeoff: pull requests queue for the database step.
- **Within a run:** tests are parallel-safe because each creates its own workspaces (ADR-0025). There is one reset per run, not per test.
- **Ordering:** database migrations are applied before the app is deployed. Expand and contract keeps the old app working in between.
- **Secrets per environment:** CLI access token, project ref, database password, and server API key. Development and CI secrets can never reach production jobs.
- **Paused projects:** a paused Free project fails CI with an explicit "project paused" check rather than obscure errors. It is restored manually. Artificial keep-alive traffic is not used.

### 10. Secrets, Ownership, and PAT Governance

| Secret / credential                                 | Owner                                                  | Storage                                                                               | Rotation                                                   | Notes                                                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase **project ref**                            | Engineering                                            | GitHub Environment variables (dev, ci, staging, prod)                                 | N/A (project lifecycle)                                    | Never in client bundle                                                                                                                                         |
| Supabase **database password**                      | Engineering                                            | GitHub Secrets per environment                                                        | On compromise or quarterly                                 | Used by CLI and server only                                                                                                                                    |
| Supabase **server API key** (secret / service role) | Engineering                                            | GitHub Secrets; local `.env.local` for dev                                            | On compromise; prefer revocable secret keys when available | `server-only` in `lib/db` (ADR-0007)                                                                                                                           |
| Supabase **CLI access token** (PAT or org token)    | **Dedicated machine identity**, not a personal account | GitHub Secrets for CI; developers use their own PAT locally only for `db push` to dev | Documented rotation; revoke on offboarding                 | **Personal PATs must not be stored in CI.** CI uses an org/service account token where Supabase supports it; otherwise a shared bot account with minimal scope |
| Clerk, Stripe keys                                  | Engineering                                            | GitHub Secrets per environment                                                        | Vendor dashboards                                          | ADR-0005, ADR-0013                                                                                                                                             |

**Governance rules:**

- Production and CI Supabase tokens are **never** the same credential.
- Developers link the CLI to **dev** with credentials that cannot push to **ci**, **staging**, or **prod** (separate project refs and least-privilege tokens).
- Offboarding checklist: revoke developer PATs; rotate shared bot token if the leaver had access.
- All secret access is documented in the environment runbook (ADR-0036).

### 11. Future Supabase Storage (Compatibility Note)

File storage is **out of scope for v1** (`project-context.md`). When a derived product adds Storage:

- The **RLS lockdown model (ADR-0007) still applies.** Bucket policies must not become the only authorization layer; server-side access remains primary unless a new ADR explicitly adds client Storage with Clerk JWT and tested policies.
- **Migrations and config-as-code** extend to bucket definitions and policy SQL where the CLI supports them; dashboard-only bucket creation is prohibited under the same rules as schema.
- **Environment parity:** dev, CI, staging, and prod each get isolated buckets; CI tests must not depend on production bucket contents.
- Enabling Storage does **not** require Docker-based Supabase; use cloud projects and the same drift categories (config and fingerprint where applicable).

No v1 implementation is implied. This section exists so storage is not designed ad hoc in conflict with cloud-first and lockdown decisions.

## Consequences

- Migrations are the single source of truth for schema, types, and reference data. Dashboard changes are detectable.
- The development and CI data model is disposable by design.
- The CI database step is serialized and slower than local Docker would be.
- A developer cannot work offline.
- One shared development project means a single developer at a time for schema work. A team needs either serialized schema changes through `main` or paid per-developer projects or branching.

## Risks

| Risk                                                                        | Impact                                                                        | Mitigation                                                                           |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Unmerged branch migrations left in development                              | Development drifts from `main`, and types are generated from the wrong schema | Reset development before schema branches. CI types come from the CI project only     |
| Free projects pause when inactive                                           | CI fails                                                                      | Explicit pause check. Manual restore                                                 |
| Free tier limits (project count, storage, compute)                          | Cannot add environments. CI can hit size limits                               | Staging and production on a paid tier. Resets keep CI small                          |
| Public reachability from day one                                            | Any unlocked object is exposed                                                | Lockdown as migration one, and catalog checks on every pull request                  |
| Supabase CLI needs Docker for some commands                                 | Workflow gaps                                                                 | Workflow avoids `db diff`, `db pull`, and `db dump`. Fingerprinting replaces diffing |
| Postgres major version mismatch between projects created at different times | Behavior drift                                                                | The fingerprint includes the version. Upgrade to align before launch                 |
| Dashboard edits during incidents                                            | Drift from migrations                                                         | Scheduled drift check. Mandatory follow-up migration                                 |
| CLI access token tied to a personal account                                 | Offboarding and rotation risk                                                 | Section 10: no personal PAT in CI; dedicated bot or org token; rotation runbook      |
| Non-atomic database and app deploy                                          | Runtime errors mid-deploy                                                     | Expand and contract rule                                                             |
| Backups resurrect erased data                                               | GDPR breach                                                                   | Erasure ledger re-applied after restore                                              |
| No point-in-time recovery on lower tiers                                    | Data loss window                                                              | Owner decides production tier and target recovery (ADR-0036)                         |

## Implementation Verification (P0-T15)

Architecture is accepted. Supabase product behavior changes over time. **P0-T15** verifies operational assumptions before P2 relies on them (not a reopening of this ADR unless a check fails):

- Which CLI commands work without Docker: `db push`, `db reset --linked`, `migration list`, `gen types`, config push, `db lint --linked`, `--include-seed`.
- Current Free tier limits: active project count, inactivity pausing, database size, backup availability.
- Availability of secret API keys, and of organization-scoped access tokens.
- Which project settings the CLI can push, and which need a Management API check.

Any failed assumption is recorded as an amendment to this ADR before P2 starts.

### P0-T15 record (2026-09-28)

Verified against **Supabase CLI 2.118.0** (npm) on a host **without Docker**. Full matrix: [`docs/runbooks/supabase-cloud.md`](../../docs/runbooks/supabase-cloud.md).

- **Confirmed:** cloud-first path without Docker for `db push`, `db reset --linked`, `migration list` (remote flags), `gen types` (`--project-id` / `--linked` / `--db-url`), `config push` / `config diff`, `db lint --linked`, and `db push --include-seed`. Free tier: two active projects, ~7-day inactivity pause, no backups, 500 MB DB per project.
- **Confirmed:** `db diff` (and documented `db pull`) require Docker (shadow DB / local container). Workflow continues to avoid them.
- **Clarification (non-blocking):** security and performance advisor output is exposed as `supabase db advisors --linked` in CLI 2.x; P2 catalog checks may use `db lint` and `db advisors` together.
- **Not exercised in-repo (requires P0-T17 / owner):** live `link`, `push`, and type generation against dev/ci projects; dashboard confirmation of revocable secret API keys and org/bot access tokens for CI.

No decision changes were required.

## Alternatives Considered

- **Local Docker Supabase as primary** (the earlier ADR-0033 recommendation): rejected by owner constraint.
- **One Free project shared by development and CI:** violates the rule never to share environments. CI resets would destroy development work.
- **Plain Postgres service container in CI:** Supabase roles, schemas, and extensions are missing. It would validate a different database than the one in production.
- **Supabase branching:** paid feature. Worth reconsidering for per-pull-request databases once on a paid tier.
- **Dashboard-first with `db pull`:** makes the dashboard the source of truth, and needs Docker.
