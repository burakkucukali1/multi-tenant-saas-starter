# P4 — Tenancy and RBAC

- Status: todo
- Depends on: P3
- ADRs: 0004, 0006, 0008, 0010, 0011, 0017, 0018, 0021, 0028, 0032, 0038

## Goal

Workspaces with memberships, flat database-backed roles, tenant context, invitations, ownership transfer, and workspace lifecycle, all isolated and audited.

## Scope

- `features/authz`, `features/workspaces`, `features/memberships`, `features/tenant-context`
- `workflows/onboarding`, `workflows/invitations`, `workflows/ownership-transfer`, `workflows/workspace-lifecycle`, `workflows/user-erasure`
- Workspace-level DPA acceptance

Out of scope: entitlements and seat limits (P5 adds the seat check to invitations), platform-side operations (P7).

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`, `auth.md`, `saas.md`
- Patterns: `.ai/patterns/multi-tenant.md`, `.ai/patterns/rbac.md`, `.ai/patterns/audit-logging.md`
- ADR-0010, 0011, 0021, 0028, 0038

## Open Questions

- ADR-0038 ownership rules and slug editability (blocks T08, T11)
- ADR-0032 grace period (blocks T12)
- Permission grants per role. Owner approval required (blocks T02)
- Invitation email match rule (ADR-0028) (blocks T09)

## Tasks

| ID | Task | Level | Status | Depends |
|---|---|---|---|---|
| P4-T01 | `roles`, `permissions`, `role_permissions` schema (reference class). Seed the four system roles | L2 | todo | — |
| P4-T02 | Permission key registry, role grant matrix (owner-approved), registry-versus-seed CI check | L3 | todo | T01 |
| P4-T03 | Pure `can()` and entry-point guards | L2 | todo | T02 |
| P4-T04 | `workspaces` schema: slug partial unique, lifecycle class, composite key | L2 | todo | — |
| P4-T05 | `memberships` schema: composite FKs, partial unique `(workspace_id, user_id)` | L2 | todo | T01, T04 |
| P4-T06 | `features/tenant-context`: slug to workspace to membership to permissions, plus `WorkspaceScope` minting | L2 | todo | T03, T05 |
| P4-T07 | Workspace-level DPA acceptance check (Owner accepts) | L2 | todo | T06 |
| P4-T08 | `workflows/onboarding`: `tx_create_workspace` (workspace, Owner membership, audit) and DPA acceptance | L2 | todo | T06, T07, ADR-0038 |
| P4-T09 | `workflows/invitations`: create, revoke, copy link, `tx_accept_invitation` | L2 | todo | T06 |
| P4-T10 | Member management: change role, remove member, leave workspace (audited) | L2 | todo | T06 |
| P4-T11 | `workflows/ownership-transfer`: `tx_transfer_ownership` | L2 | todo | T10, ADR-0038 |
| P4-T12 | `workflows/workspace-lifecycle`: soft delete with grace period, restore | L2 | todo | T06, ADR-0032 |
| P4-T13 | `workflows/user-erasure`: pseudonymization across immutable tables, membership handling, and erasure ledger entries (subject ID and time only, ADR-0041 §8) | L2 | todo | T10 |
| P4-T14 | Workspace switcher and tenant member UI | L1 | todo | T06 |
| P4-T15 | Tenant authorization matrix tests. The isolation suite covers all new tables | L2 | todo | T03–T13 |
| P4-T16 | E2E: create workspace, invite, accept, role change takes effect, cross-workspace URL is refused | L1 | todo | T14 |

## Exit Criteria

- The authorization matrix and the isolation suite are green.
- Every membership, role, and ownership change produces an audit entry inside its transaction.
