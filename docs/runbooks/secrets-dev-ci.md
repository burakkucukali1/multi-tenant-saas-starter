# Dev and CI secrets (P0-T17)

Per-environment Supabase credentials for **development** and **CI** only. Production secrets wait for ADR-0036 (ADR-0041 §10).

## Inventory

| Credential                                 | Development                                            | CI (GitHub Actions)                                                                            |
| ------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Project ref                                | `SUPABASE_PROJECT_REF` in `.env.local`                 | `SUPABASE_CI_PROJECT_REF` in `.env.local`; repository variable or secret when P2 CLI jobs land |
| Database password                          | `SUPABASE_DB_PASSWORD`                                 | `SUPABASE_CI_DB_PASSWORD` in `.env.local`; `SUPABASE_CI_DB_PASSWORD` secret (P2+)              |
| Server API key (service role / secret key) | `SUPABASE_SERVICE_ROLE_KEY`                            | `SUPABASE_CI_SERVICE_ROLE_KEY` locally; `SUPABASE_CI_SERVICE_ROLE_KEY` secret (P2+ / `lib/db`) |
| Direct Postgres URL (pooler)               | `DATABASE_URL` (dev project)                           | `SUPABASE_TEST_DATABASE_URL` repository secret (integration tests)                             |
| CLI access token                           | `SUPABASE_ACCESS_TOKEN` in `.env.local` (personal PAT) | `SUPABASE_ACCESS_TOKEN` repository secret (bot/org token, **not** a personal PAT)              |
| Public API URL                             | `NEXT_PUBLIC_SUPABASE_URL`                             | N/A in P0                                                                                      |

**Separation rules:** dev and CI use different project refs, passwords, and server keys. CI credentials must not appear in production jobs (future GitHub Environments).

## Local development (`.env.local`)

1. Copy [`.env.example`](../../.env.example) to `.env.local`.
2. From Supabase Dashboard → each project → **Settings → API** and **Database**:
   - Dev: fill dev ref, `service_role` (or revocable secret key), pooler connection string as `DATABASE_URL`.
   - CI: fill CI ref, CI service role, pooler URL as `SUPABASE_TEST_DATABASE_URL` (used when running integration tests locally against the CI project).
3. Optional: [Account → Access tokens](https://supabase.com/dashboard/account/tokens) → personal token → `SUPABASE_ACCESS_TOKEN` for `supabase link` / `db push` to **dev** only.
4. Verify:

```bash
pnpm test:integration
```

Integration smoke connects when `SUPABASE_TEST_DATABASE_URL` (or `DATABASE_URL` if Supabase URL unset) is set; see [`tests/README.md`](../../tests/README.md).

## GitHub repository secrets

**Settings → Secrets and variables → Actions → Repository secrets.**

| Secret                         | Value source                                            | Required in P0                                        |
| ------------------------------ | ------------------------------------------------------- | ----------------------------------------------------- |
| `SUPABASE_TEST_DATABASE_URL`   | CI project → Database → Connection string (pooler, URI) | Yes — integration job runs DB smoke; skips when unset |
| `SUPABASE_ACCESS_TOKEN`        | Org/bot or dedicated machine token                      | Inventory now; CLI jobs in P2                         |
| `SUPABASE_CI_PROJECT_REF`      | CI project ref                                          | Inventory now; CLI in P2                              |
| `SUPABASE_CI_DB_PASSWORD`      | CI database password                                    | Inventory now; CLI in P2                              |
| `SUPABASE_CI_SERVICE_ROLE_KEY` | CI project API secret / service role key                | Inventory now; server DB client in P2+                |

Do **not** add dev project passwords or dev service role keys to GitHub.

Set via CLI (replace values locally; do not commit):

```bash
gh secret set SUPABASE_TEST_DATABASE_URL
gh secret set SUPABASE_ACCESS_TOKEN
gh secret set SUPABASE_CI_PROJECT_REF
gh secret set SUPABASE_CI_DB_PASSWORD
gh secret set SUPABASE_CI_SERVICE_ROLE_KEY
```

## Verification checklist (P0-T17)

- [ ] `.env.local` exists from `.env.example` with dev + CI Supabase fields filled.
- [ ] Revocable **secret** API keys confirmed in dashboard when offered (else service role documented).
- [ ] CI repository secret `SUPABASE_TEST_DATABASE_URL` set; CI workflow **Integration tests** job passes.
- [ ] P2 CLI secrets (`SUPABASE_ACCESS_TOKEN`, CI ref/password) stored for future workflows; personal PAT never in CI.
- [ ] `supabase link --project-ref <dev-ref>` succeeds locally (optional until P2 migrations).

Record completion date in [`supabase-cloud.md`](supabase-cloud.md) § P0-T17 record.

## Related

- [ADR-0041 §10](../../.ai/decisions/0041-cloud-first-supabase-workflow.md)
- [`.github/README.md`](../../.github/README.md)
- [Supabase cloud runbook](supabase-cloud.md)
