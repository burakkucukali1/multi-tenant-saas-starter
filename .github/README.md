# GitHub configuration

Repository governance (ADR-0026, ADR-0027):

| Artifact                                               | Purpose                                                  |
| ------------------------------------------------------ | -------------------------------------------------------- |
| [`pull_request_template.md`](pull_request_template.md) | Task ID, approval level, checklist, validation           |
| [`branch-protection.md`](branch-protection.md)         | Owner steps for protecting `main` and required CI checks |
| [`workflows/ci.yml`](workflows/ci.yml)                 | Automated checks on pull requests and `main`             |

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

## Repository secrets (placeholders — never commit values)

Configure in **Settings → Secrets and variables → Actions**. Names only; values come from the Supabase CI project (ADR-0041).

| Secret                       | Used by                                      | Required for P0 CI green   |
| ---------------------------- | -------------------------------------------- | -------------------------- |
| `SUPABASE_TEST_DATABASE_URL` | Integration job (`pg` smoke / future suites) | No — tests skip when unset |
| `DATABASE_URL`               | Fallback for integration URL                 | No                         |

Future (P2+ migrations and Supabase CLI in CI):

| Secret                    | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN`   | CLI / Management API (dedicated bot token, not a personal PAT) |
| `SUPABASE_CI_PROJECT_REF` | CI project identifier                                          |
| `SUPABASE_CI_DB_PASSWORD` | Database password for CLI operations                           |

GitHub **Environments** (`ci`, `dev`, `production`) will gate production credentials when ADR-0036 is resolved.

## Required status checks (branch protection)

After CI has run on `main`, require these checks before merge (see [`branch-protection.md`](branch-protection.md)):

1. `Lint, types, tests, and build`
2. `Integration tests (CI Postgres)`
