# ADR-0040: Impersonation Policy

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 7
- Related: ADR-0012

## Context

Impersonation, meaning a platform admin acting as a tenant user, carries the highest isolation risk in the admin surface.

## Options

1. **No impersonation in v1.** Platform admins use read models and platform-minted `WorkspaceScope` commands only.
2. **Audited, time-boxed impersonation.**
   - A distinct code path builds a `TenantContext` marked as impersonated.
   - It is time-limited and visibly bannered, fully audited, and may be read-only.
   - It is never granted by adding a permission to a platform role.

## Recommendation

Option 1. ADR-0012 already covers the support use cases without taking on this risk.

## Decision

Pending owner decision.
