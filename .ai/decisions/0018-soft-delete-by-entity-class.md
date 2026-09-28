# ADR-0018: Soft Delete by Entity Class, GDPR Erasure, and Manual Purge

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0010, ADR-0019, ADR-0032

## Context

"Soft delete everywhere" conflicts with immutable records and with GDPR erasure. It also adds a filter that is easy to forget. Background jobs are out of scope, so nothing can purge automatically.

## Decision

Every table declares one class in its migration comment:

| Class     | Examples                                                                               | Policy                                                                       |
| --------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Lifecycle | workspaces, memberships, users                                                         | `deleted_at`, grace period, then purge                                       |
| Immutable | audit logs, legal acceptances, promo redemptions, referral attributions                | Insert-only, with `UPDATE` and `DELETE` revoked. Erasure by pseudonymization |
| Reference | plans, plan entitlements, roles, permissions, legal document versions, promo campaigns | `archived_at`, never deleted                                                 |
| Ephemeral | invitation tokens, webhook idempotency keys                                            | Hard delete or expire                                                        |

Rules:

- Repositories inject `deleted_at IS NULL` automatically, the same way they inject `workspace_id`.
- Unique constraints on lifecycle tables are partial indexes (`WHERE deleted_at IS NULL`).
- Cascades are explicit inside the entity's `tx_*` delete or purge function. Foreign key `ON DELETE CASCADE` is not used across lifecycle tables.
- Immutable tables store actor and subject **IDs only**, never names or emails. Erasing a user record removes personal data from those tables without editing them.
- **Purge in v1** is a manual, audited platform admin action. `pg_cron` counts as a background job and is out of scope.
- Grace period and retention values are pending (ADR-0032).

## Consequences

- Correct handling for each kind of data, and GDPR erasure is feasible.
- Meeting GDPR's one-month erasure deadline depends on an operator acting. That is a documented operational risk.

## Alternatives Considered

- Soft delete everywhere: see Context.
- Hard delete everywhere: nothing can be recovered, and history is lost.
