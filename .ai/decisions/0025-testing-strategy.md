# ADR-0025: Testing Strategy

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0010, ADR-0011, ADR-0021, ADR-0041

## Context

Without an ORM, in a multi-tenant system, most defects will be in data access and authorization.

## Decision

- **Unit (Jest):** pure logic only, such as permission checks, entitlement resolution, context assembly, and token derivation.
- **Integration (Jest against Supabase Cloud Postgres on the CI project):** the primary investment (ADR-0041). Covers repositories, `tx_*` functions (including rollback), lockdown checks, Server Actions with Clerk stubbed, and webhook handlers.
- **Tenant isolation suite:** generated from the schema. Every table with `workspace_id` gets cross-workspace read and write denial tests, run through the repositories and against the anon key.
- **Authorization matrix:** generated from the permission registries. Covers every tenant role × permission × entry point, and every platform role × platform permission. Includes the assertion that neither namespace grants the other anything.
- **Architecture tests:** dependency rules (ADR-0021), and the registry-versus-seed checks for permissions, entitlements, audit action keys, and i18n key parity.
- **E2E (Playwright):** critical flows only (see `project-context.md`).
- **Coverage:** no global percentage. `features/authz`, `platform/access`, `features/entitlements`, and every `tx_*` function must have full branch coverage.
- **Test data:** per-test factories that create fresh workspaces. Shared cross-test fixtures are forbidden.
- Integration tests run against the dedicated `<app>-ci` project, reset per CI run (ADR-0041). Developers may run the same suites against `<app>-dev` locally.

## Consequences

- High confidence where failures are most costly.
- CI runs against a real database, so it is slower and needs investment in stable test infrastructure.

## Alternatives Considered

- A unit-heavy pyramid with mocked database: mocks hide exactly the bugs that matter here.
