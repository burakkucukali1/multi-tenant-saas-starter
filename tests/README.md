# Cross-cutting test suites

ADR-0025 testing layout for this repository.

## Projects

| Project | Config | Location |
|---|---|---|
| Unit | `jest.config.mjs` (project `unit`) | `tests/unit/**/*.test.ts` |
| Integration | `jest.config.mjs` (project `integration`) | `tests/integration/**/*.test.ts` |

Run:

```bash
pnpm test          # all Jest projects
pnpm test:unit
pnpm test:integration
```

## Integration database (ADR-0041)

Integration tests use the **CI Supabase Postgres** project (`<app>-ci`) via direct connection string:

- `SUPABASE_TEST_DATABASE_URL` (preferred), or
- `DATABASE_URL`

When unset, integration smoke tests **skip** (foundation only until P0-T16/T17).

Future suites (P2+): tenant isolation, authorization matrix, repository and `tx_*` tests.

Per-test workspace factories only — no shared cross-test fixtures (ADR-0025).
