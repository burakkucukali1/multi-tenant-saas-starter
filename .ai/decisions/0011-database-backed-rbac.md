# ADR-0011: Database-Backed RBAC with Flat Roles

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0012, ADR-0022

## Context

Tenant authorization must be database-backed and auditable. Custom roles are out of scope for v1. Role hierarchies are a common cause of recursive authorization chains.

## Decision

- System roles: Owner, Admin, Member, Viewer. They are seeded by migration and never deleted (archived only).
- Tables: `roles`, `permissions`, `role_permissions`, all owned by the `authz` feature.
- **Flat roles.** Every role's permissions are explicit grants. There is no inheritance and no "role includes role".
- Permission keys are defined in a typed registry in code and seeded by migration. CI fails if the registry and the seed differ.
- The permission set is resolved once per request into the tenant context. `can(context, permission)` is a pure, synchronous set lookup.
- Repositories never perform authorization. Entry points (Server Actions, Route Handlers, workflows) do.
- The frontend uses permissions for UX only.
- Exact permission grants per role are defined in Phase 4 and require owner approval.

## Consequences

- Authorization cannot recurse and is trivially testable with matrix tests.
- Some grants are duplicated across roles. That is accepted in exchange for explicitness.
- Adding custom roles later only adds rows. The model does not change.

## Alternatives Considered

- Role hierarchy: less duplication, but recursive resolution and harder reasoning.
- Clerk roles: rejected by ADR-0005.
