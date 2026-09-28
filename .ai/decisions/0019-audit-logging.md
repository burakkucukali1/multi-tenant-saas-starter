# ADR-0019: Audit Logging

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0008, ADR-0012, ADR-0018, ADR-0022

## Context

Billing, membership, ownership, and platform actions must be auditable. Audit logs written by triggers are a source of hidden recursion.

## Decision

- One append-only `audit_log` table. `UPDATE` and `DELETE` are revoked from every role.
- Columns: actor type (`user`, `platform_admin`, `system`), actor ID, workspace ID (nullable for platform-level events), action key, target type, target ID, metadata (JSON, **no PII**), created time.
- Audit entries are written explicitly by the `audit` feature (rank 10), never by triggers.
- Critical actions (membership and role changes, ownership transfer, billing changes, deletions and purges, every platform mutation, `WorkspaceScope` minting by platform) insert their audit entry inside the same `tx_*` transaction.
- Action keys come from a typed registry.
- `audit` writes only. It does not depend on any feature. Reading is done by tenant and platform read models.
- Retention is pending (ADR-0032).

## Consequences

- A mutation can never succeed without its audit entry.
- The table grows without bound. Partitioning or archival is needed before it becomes the largest table.

## Alternatives Considered

- Trigger-based auditing: implicit and recursive, and it cannot capture the actor context.
