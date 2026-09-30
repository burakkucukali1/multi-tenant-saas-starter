# Cross-cutting test suites

ADR-0025 testing layout for this repository.

## Projects

| Project     | Config                                    | Location                         |
| ----------- | ----------------------------------------- | -------------------------------- |
| Unit        | `jest.config.mjs` (project `unit`)        | `tests/unit/**/*.test.ts`        |
| Integration | `jest.config.mjs` (project `integration`) | `tests/integration/**/*.test.ts` |
| E2E         | `playwright.config.ts`                    | `tests/e2e/**/*.spec.ts`         |

Run:

```bash
pnpm test          # all Jest projects
pnpm test:unit
pnpm test:integration
pnpm test:e2e:install   # once per machine / CI image (Chromium)
pnpm test:e2e
pnpm ci:check       # mirrors CI quality gates (add Playwright separately)
```

### E2E (Playwright)

- Config: `playwright.config.ts` at repo root (ADR-0025, ADR-0026).
- Local: starts `next dev` unless the server is already listening on the configured base URL.
- CI: set `CI=1`; Playwright runs `next build && next start` before tests (`reuseExistingServer: false`).
- Override server: `PLAYWRIGHT_SKIP_WEBSERVER=1` and `PLAYWRIGHT_BASE_URL` when the app is started externally (future workflow).

## Integration database (ADR-0041)

Integration tests use the **CI Supabase Postgres** project (`<app>-ci`) via direct connection string:

- `SUPABASE_TEST_DATABASE_URL` (preferred), or
- `DATABASE_URL` (fallback only when the Supabase variable is unset or blank)

If both are set, integration tests connect with **`SUPABASE_TEST_DATABASE_URL`**; changing only `DATABASE_URL` will not affect the smoke test.

Local: set in **`.env.local`** (loaded by `tests/integration/setup-env.cjs` before tests run). CI: GitHub Actions secrets (`SUPABASE_TEST_DATABASE_URL`). When unset, integration smoke tests **skip**.

Future suites (P2+): tenant isolation, authorization matrix, repository and `tx_*` tests.

Per-test workspace factories only — no shared cross-test fixtures (ADR-0025).
