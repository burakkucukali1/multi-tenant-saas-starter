# ADR-0004: Multi-Tenant Model — User, Membership, Workspace

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0005, ADR-0006, ADR-0010

## Context

The starter must support multiple isolated tenants, with users who can belong to more than one tenant.

## Decision

- The tenant is called a **Workspace**. This term is used in table names, route segments, UI copy, and i18n keys.
- The model is User → Membership → Workspace. A membership carries exactly one role.
- A user can belong to many workspaces.
- Storage: one database and one shared schema. Every tenant-owned table has `workspace_id NOT NULL`.
- Indexes on tenant-owned tables start with `workspace_id`.

## Consequences

- Shared schema is simple to run and to migrate.
- Isolation depends on application discipline and constraints, so ADR-0010 is mandatory.
- Noisy-neighbor and data-residency needs cannot be met without re-architecture. That is acceptable for v1.

## Alternatives Considered

- Schema per tenant: stronger isolation, but migrations and connection handling become much more expensive.
- Database per tenant: costly to operate and more than the starter needs.
