# Supabase Cloud workflow runbook (ADR-0041)

Verification record for **P0-T15** (2026-09-28). Evidence gathered without production credentials unless noted.

## CLI pin (verification baseline)

| Item              | Value                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| CLI tested        | `supabase@2.118.0` (npm)                                                                          |
| Verification host | Windows, Node 24.x, **Docker not running**                                                        |
| Repo state        | `supabase/migrations/` empty (`.gitkeep` only); **no `config.toml` yet** (expected before P2-T01) |

**P2-T01 action:** add the same CLI version as a dev dependency and regenerate this section when the pin changes.

## Command matrix (Docker vs cloud-only)

| Command                                                    | Remote / linked cloud                                  | Docker required?                                             | P0-T15 result                                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `supabase login`                                           | Management API                                         | No                                                           | Not run (needs interactive PAT); CI uses `SUPABASE_ACCESS_TOKEN`                                |
| `supabase link --project-ref <ref>`                        | Yes                                                    | No                                                           | Not run (needs project ref + DB password); owner with dev project                               |
| `supabase migration new <name>`                            | Local files only                                       | No                                                           | Assumed OK (creates SQL under `supabase/migrations/`)                                           |
| `supabase migration list --linked`                         | Yes                                                    | No                                                           | Not run (needs link or `--db-url`)                                                              |
| `supabase db push` / `--include-seed`                      | Yes (`--linked`, `--db-url`, `--project-ref`)          | **No** (per CLI help; applies migrations on remote Postgres) | **Consistent with ADR**                                                                         |
| `supabase db reset --linked`                               | Yes (destructive rebuild from local migrations + seed) | No for remote target                                         | **Consistent with ADR** CI reset model                                                          |
| `supabase db diff` (default / `--local`)                   | N/A                                                    | **Yes** (shadow DB via Docker)                               | **Confirmed** — fails without Docker on this machine                                            |
| `supabase db pull`                                         | Yes                                                    | **Yes** (documented)                                         | **Consistent with ADR** (workflow avoids pull)                                                  |
| `supabase db dump`                                         | Yes                                                    | Uses `pg_dump` against remote; no local shadow in help       | Treat as **non-primary**; ADR avoids dump for drift                                             |
| `supabase gen types --project-id <ref> -s public,platform` | Yes                                                    | **No**                                                       | **Consistent with ADR**                                                                         |
| `supabase gen types --linked` / `--db-url`                 | Yes                                                    | No                                                           | Same                                                                                            |
| `supabase db lint --linked`                                | Yes                                                    | No (failed here with `ProjectRefNotLinkedError`, not Docker) | **Consistent with ADR**                                                                         |
| `supabase db advisors --linked`                            | Yes (security / performance)                           | No                                                           | **Clarification:** use for “security advisor” checks in P2; ADR text says “db lint” generically |
| `supabase config diff` / `config push`                     | Yes                                                    | No                                                           | Requires `supabase/config.toml` (after `supabase init` in P2)                                   |
| `supabase db push --dry-run`                               | Yes                                                    | No                                                           | Suitable for CI preview before apply                                                            |

### Commands intentionally excluded from the starter workflow

`db diff`, `db pull`, and dashboard-first schema edits remain **out of scope** per ADR-0041. Drift uses migration history, fingerprint SQL, and config diff/push instead.

## Free tier and environment separation (documented product behavior)

Sources: [Supabase pricing](https://supabase.com/pricing), [Project pausing](https://supabase.com/docs/guides/platform/free-project-pausing) (checked 2026-09-28).

| Assumption (ADR-0041)                           | Verified?   | Notes                                                                      |
| ----------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| **Two active Free projects** per org (dev + ci) | Yes         | Pricing: “Limit of 2 active projects” on Free                              |
| **Separate dev and ci projects** (never shared) | Yes (owner) | Owner confirmed both projects exist; operational discipline still required |
| **Pause after ~7 days inactivity** on Free      | Yes         | Documented; warning email ~1 week before pause                             |
| **No automated backups on Free**                | Yes         | Backups / PITR on paid tiers                                               |
| **500 MB DB per Free project**                  | Yes         | Plan limits; CI reset + small seed keeps headroom                          |
| Staging / prod on paid tier                     | Unchanged   | ADR-0036 still open                                                        |

**CI implication:** implement an explicit **“project paused”** preflight in P2 (ADR-0041 §9) before `db push` / reset.

## Type generation workflow

| Step                                                   | ADR assumption | Verification                                             |
| ------------------------------------------------------ | -------------- | -------------------------------------------------------- |
| Canonical types from **CI project** after migrations   | Yes            | `--project-id` or `--db-url` against CI; no Docker       |
| Developers may generate from **dev** for ergonomics    | Yes            | Same CLI flags against dev ref                           |
| CI fails on `git diff` for `lib/db/types.generated.ts` | Planned P2     | Not implemented in P0                                    |
| Schemas `public`, `platform`                           | Yes            | `--schema public --schema platform` (or `-s` comma list) |

## Migration workflow

| Step                                        | Verification                                   |
| ------------------------------------------- | ---------------------------------------------- |
| Source of truth `supabase/migrations/*.sql` | Repo layout present                            |
| Hand-written migrations (no `db diff`)      | Docker required for `db diff` — **do not use** |
| `db push` to dev on feature branches        | Supported without Docker                       |
| `db push --include-seed` for dev/ci seed    | Flag exists on CLI 2.118.0                     |
| Immutability after merge                    | Process (ADR), not CLI                         |
| `migration repair`                          | Level 2 — unchanged                            |

## Drift detection (without Docker)

| Category           | Detection method                                      | P0-T15                      |
| ------------------ | ----------------------------------------------------- | --------------------------- |
| Migration history  | `migration list --linked` vs git files                | CLI supports; script in P2  |
| Schema fingerprint | `pg_catalog` query via `db query` / integration tests | P2                          |
| Platform config    | `config diff` + future Management API script          | Needs `config.toml` (P2)    |
| `db diff`          | Not used                                              | Confirmed Docker dependency |

## Secret management (assumptions — not exercised in P0)

| Secret                                 | ADR-0041 storage                                | P0-T15                                                                                                    |
| -------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN`                | GitHub Secret (bot/org PAT, not personal in CI) | **Owner:** configure in P0-T17; use `supabase login` token or env var in CI                               |
| Project ref                            | GitHub Environment variables per env            | Placeholder names in `.github/README.md`                                                                  |
| Database password                      | GitHub Secrets                                  | Used by `link`, `db push`, pooler URL for Jest                                                            |
| Server API key (secret / service role) | GitHub Secrets + `.env.local`                   | **Owner verify:** Dashboard → Project Settings → API keys (prefer revocable **secret** keys when offered) |
| Dev vs CI credentials **never shared** | Separate project refs and tokens                | Process + separate GitHub secrets                                                                         |

**Live checks pending P0-T17:** `supabase link`, `db push --dry-run`, `migration list --linked`, `gen types --project-id`, on **dev** and **ci** projects.

## CI project workflow (planned P2 — assumptions)

| Job step          | CLI / tool                                               | Concurrency                                                            |
| ----------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Pause check       | Management API or `projects list`                        | `supabase-ci-project` (already in `.github/workflows/ci.yml` for Jest) |
| Reset CI          | `db reset --linked --yes` (or equivalent via `--db-url`) | Same concurrency group                                                 |
| Migrate           | `db push`                                                | Same                                                                   |
| Seed              | `--include-seed` or seed paths                           | Same                                                                   |
| Types             | `gen types` + `git diff --exit-code`                     | Same                                                                   |
| Integration tests | Jest + `SUPABASE_TEST_DATABASE_URL`                      | Already serialized                                                     |

Current P0 CI runs Jest integration only; database migration steps land in **P2**.

## Owner checklist (after P0-T17)

1. `pnpm exec supabase --version` matches pinned version (P2-T01).
2. `supabase link --project-ref <dev-ref>` (local profile only for dev).
3. `supabase migration list --linked` on dev and ci (separate links or `--project-ref`).
4. `supabase gen types --project-id <ci-ref> --schema public,platform` (dry run output sanity).
5. Confirm **secret** API key exists for server-side use (ADR-0007).
6. Document any dashboard-only settings in this runbook until `config push` covers them.

## Related

- [ADR-0041](../../.ai/decisions/0041-cloud-first-supabase-workflow.md)
- [`.github/README.md`](../../.github/README.md) — GitHub secrets placeholders
- [P2 data foundation](../../.ai/progress/phases/p2-data-foundation.md)
