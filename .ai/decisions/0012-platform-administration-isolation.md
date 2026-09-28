# ADR-0012: Platform Administration Isolation

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0009, ADR-0010, ADR-0011, ADR-0039, ADR-0040

## Context

Platform administrators operate across all workspaces. Their permissions must stay completely isolated from tenant permissions. Admin writes must not duplicate business rules, and must not introduce a "bypass tenant" flag.

## Decision

- **Separate identity and permissions.**
  - `platform.platform_admins`, `platform.platform_roles`, `platform.platform_permissions`, and `platform.platform_role_permissions`.
  - Separate permission namespace (`platform.*`).
  - Separate context resolver, `PlatformContext`.
- **Mutual exclusion.**
  - Tenant `authz` never reads platform tables, and `platform/access` never reads memberships.
  - A platform admin has no tenant permissions, and a tenant role grants no platform permissions.
  - These are enforced by import rules and authorization matrix tests.
- **Surface.** Route group `(platform)` with its own middleware matcher. Platform routes never render tenant feature components. They share only `shared/`.
- **Reads.** Platform read models live in `platform/*`, use `lib/db/platform`, and may query across workspaces. They never reuse tenant repositories.
- **Writes.**
  - Platform write operations call the same domain commands and workflows as the tenant side, passing a `WorkspaceScope` minted by `platform/access` after checking a platform permission.
  - Minting writes an audit entry recording the platform actor.
  - Domain commands have no bypass parameter.
- Every platform mutation is audited. Whether sensitive platform reads (PII detail views) are also audited is open in ADR-0039.

## Consequences

- Business rules exist once and isolation is structural.
- Read queries are deliberately duplicated between tenant and platform code. The Rule of Three does not apply across a security boundary. This must stay documented so nobody "fixes" it later.
- Platform KPIs are computed on demand. They will need materialized aggregates once jobs are in scope.

## Alternatives Considered

- Reusing tenant services with a `bypassTenant` option: the most likely source of a future cross-tenant leak.
- Fully separate platform write logic: business rules would drift between the two copies.
