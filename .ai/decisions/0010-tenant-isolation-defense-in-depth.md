# ADR-0010: Tenant Isolation — Defense in Depth

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0004, ADR-0007, ADR-0012

## Context

Multi-tenant isolation is the project's critical requirement. The server path does not have database-enforced RLS (ADR-0007), so isolation needs several independent layers.

## Decision

1. **Schema.**
   - Tenant-owned parents have `UNIQUE (workspace_id, id)`.
   - Children reference parents with composite foreign keys on `(workspace_id, parent_id)`.
   - Cross-workspace references are therefore impossible in the database.
2. **WorkspaceScope.**
   - Tenant data access requires a `WorkspaceScope`, an opaque server-side value bound to exactly one workspace.
   - Repositories inject the `workspace_id` filter (and the soft-delete filter, ADR-0018) themselves.
   - No repository function accepts a raw workspace ID from client input.
3. **Scope minting.** Exactly two code paths can create a `WorkspaceScope`:
   - tenant authorization, from a verified membership
   - platform authorization, from a platform permission, which writes an audit entry
4. **Request context.**
   - Tenant context (user, workspace, membership, role, permissions, entitlements) is resolved once per request in a cached server function.
   - Nothing deeper in the stack resolves it again.
5. **Tests.**
   - A generated isolation suite asserts cross-workspace read and write denial for every table with `workspace_id`.
   - It runs through the repositories and also against the anon key.

## Consequences

- A single mistake in one layer does not leak data.
- One composite unique constraint per parent table.
- Adding a tenant table automatically adds isolation tests.

## Alternatives Considered

- Filtering by `workspace_id` by convention only: the most common source of tenant leaks.
