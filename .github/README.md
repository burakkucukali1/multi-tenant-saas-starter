# GitHub configuration

Repository governance (ADR-0026, ADR-0027):

| Artifact                                               | Purpose                                                  |
| ------------------------------------------------------ | -------------------------------------------------------- |
| [`pull_request_template.md`](pull_request_template.md) | Task ID, approval level, checklist, validation           |
| [`branch-protection.md`](branch-protection.md)         | Owner steps for protecting `main` and required CI checks |
| [`workflows/ci.yml`](workflows/ci.yml)                 | Automated checks on pull requests and `main`             |
| [`renovate.md`](renovate.md)                           | Dependency updates via Renovate (ADR-0030)               |
| [`../renovate.json`](../renovate.json)                 | Renovate bot configuration                               |

## CI workflow (`workflows/ci.yml`)

Runs on every pull request and on pushes to `main`.

| Job             | Purpose                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| **quality**     | Prettier, ESLint, TypeScript, dependency-cruiser (+ rule self-tests), Jest unit, `next build`, Playwright smoke |
| **integration** | Jest integration against CI Postgres (serialized via `supabase-ci-project` concurrency group)                   |

Local equivalent (without E2E):

```bash
pnpm ci:check
pnpm test:e2e:install && CI=true pnpm test:e2e
```

## Repository secrets (never commit values)

Configure in **Settings → Secrets and variables → Actions**. Full inventory and local setup: [`docs/runbooks/secrets-dev-ci.md`](../docs/runbooks/secrets-dev-ci.md) (P0-T17, ADR-0041 §10).

| Secret                         | Used by                             | P0 CI                                   |
| ------------------------------ | ----------------------------------- | --------------------------------------- |
| `SUPABASE_TEST_DATABASE_URL`   | Integration job (Postgres smoke)    | Yes — job runs smoke; skips if unset    |
| `DATABASE_URL`                 | Fallback integration URL            | Optional (prefer Supabase secret above) |
| `SUPABASE_ACCESS_TOKEN`        | Supabase CLI / Management API (P2+) | Store now; bot/org token only           |
| `SUPABASE_CI_PROJECT_REF`      | CLI `--project-ref` (P2+)           | Store now                               |
| `SUPABASE_CI_DB_PASSWORD`      | CLI link / `db push` (P2+)          | Store now                               |
| `SUPABASE_CI_SERVICE_ROLE_KEY` | Server-side DB client (P2+)         | Store now                               |

Local dev uses [`.env.example`](../.env.example) → `.env.local` (dev + CI fields). GitHub **Environments** for production wait for ADR-0036.

Supabase workflow verification (P0-T15): [`docs/runbooks/supabase-cloud.md`](../docs/runbooks/supabase-cloud.md).

## Required status checks (branch protection)

After CI has run on `main`, require these checks before merge (see [`branch-protection.md`](branch-protection.md)):

1. `Lint, types, tests, and build`
2. `Integration tests (CI Postgres)`
