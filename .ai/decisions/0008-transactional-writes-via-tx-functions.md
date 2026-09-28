# ADR-0008: Transactional Writes via `tx_*` Postgres Functions

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0007, ADR-0019

## Context

supabase-js talks to Postgres over HTTP (PostgREST), one statement at a time. It cannot run a multi-statement transaction. Ownership transfer, invitation acceptance, workspace creation, promo redemption, and purges all need several writes to succeed or fail together.

## Decision

- Any write that touches more than one row set runs as a Postgres function named `tx_<verb>_<noun>`, called through `.rpc()`.
- Function rules:
  - Enforce atomicity and data invariants only. Business decisions stay in TypeScript and are passed in as parameters.
  - Take `workspace_id` from the caller's `WorkspaceScope` and validate every referenced row against it.
  - Insert the audit entry for critical actions inside the same transaction (ADR-0019).
  - Are version-controlled in migrations and covered by the generated types.
  - Are covered by integration tests, including failure and rollback cases.
  - Must not call other `tx_*` functions.
- Single-statement reads and writes use the query builder.

## Consequences

- Correct atomicity without an ORM.
- Some logic lives in SQL. The rule above keeps it thin and predictable.
- Debugging spans two languages. Integration tests reduce that cost.

## Alternatives Considered

- Sequential client calls with compensation logic: not atomic, and error-prone.
- A direct Postgres driver for transactions: a second data access path that would conflict with ADR-0007.
