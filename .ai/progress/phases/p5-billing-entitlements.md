# P5 — Catalog, Billing, Entitlements

- Status: todo
- Depends on: P4
- ADRs: 0013, 0018, 0020, 0021

## Goal

Workspaces subscribe through Stripe. Features and limits are governed by resolved entitlements (plan base plus grants).

## Scope

- `features/plans`, `features/subscriptions`, `features/entitlements`
- `lib/stripe` and the Stripe webhooks
- `workflows/checkout` and `workflows/plan-change`
- Seat enforcement added to invitations

Out of scope: promo codes, deals, referral rewards (P6), plan admin UI (P7).

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`, `saas.md`
- Integration: `.ai/integrations/stripe.md`
- Patterns: `.ai/patterns/billing.md`, `.ai/patterns/webhooks.md`
- ADR-0013, 0020, 0021

## Open Questions

Owner decisions, recorded as ADRs when the phase starts:

- Trials: yes or no, and their length
- Behavior when payment fails: hard block or grace period
- Stripe Customer Portal for payment methods and invoices, or a custom UI
- Tax and currency handling
- Default plan at workspace creation, and the initial plan catalog for the starter seed

## Tasks

| ID | Task | Level | Status | Depends |
|---|---|---|---|---|
| P5-T01 | `plans` and `plan_entitlements` schema (reference, versioned). Entitlement key registry and CI check | L2 | todo | — |
| P5-T02 | `lib/stripe` adapter. One Stripe customer per workspace | L2 | todo | — |
| P5-T03 | `subscriptions` mirror schema | L2 | todo | T01, T02 |
| P5-T04 | Stripe webhook handler: signature, idempotency, stale-event handling, upsert by Stripe ID | L2 | todo | T03 |
| P5-T05 | `entitlement_grants` schema (validity windows) and the grants API | L2 | todo | T01 |
| P5-T06 | Pure entitlement resolver (plan, active grants, usage). Seat usage meter | L2 | todo | T03, T05 |
| P5-T07 | Entitlements added to tenant context. `requireEntitlement` and `assertWithinLimit` guards | L2 | todo | T06 |
| P5-T08 | `workflows/checkout` | L2 | todo | T04 |
| P5-T09 | `workflows/plan-change`, with downgrade validation against usage | L2 | todo | T06, T08 |
| P5-T10 | Seat check in `tx_accept_invitation` | L2 | todo | T07 |
| P5-T11 | Tenant billing UI | L1 | todo | T08, T09 |
| P5-T12 | Resolver unit tests (full branch coverage), webhook replay and ordering tests | L1 | todo | T04, T06 |
| P5-T13 | E2E: subscribe, entitlement unlocks, seat limit blocks the invitation | L1 | todo | T11 |
| P5-T14 | Plans carry a stable `lookup_key` matched to Stripe prices in every mode, so no per-environment Stripe IDs are stored (ADR-0041 §5) | L2 | todo | T01 |
| P5-T15 | Manual Stripe reconciliation script to re-sync subscriptions after a restore (ADR-0041 §8) | L2 | todo | T04 |

## Exit Criteria

- Entitlement resolution is pure and fully covered by tests.
- Webhooks are idempotent under replay and reordering.
- No plan-name checks anywhere in the code.
