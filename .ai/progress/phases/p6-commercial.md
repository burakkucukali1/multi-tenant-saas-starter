# P6 — Commercial: Promo Codes, Enterprise Deals, Referral Rewards

- Status: todo
- Depends on: P5
- ADRs: 0014, 0015, 0016, 0020, 0021, 0035

## Goal

The domain logic for promo codes, enterprise deals, and referral rewards, with Stripe as the money source of truth and entitlement grants for custom access.

## Scope

- `features/promotions`, `features/deals`, `features/referrals`
- Tenant-facing promo code entry and the referral link page

Out of scope: admin management UIs (P7).

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`
- Integration: `.ai/integrations/stripe.md`
- Pattern: `.ai/patterns/billing.md`
- ADR-0014, 0015, 0016, 0035

## Open Questions

- ADR-0035 referral reward rules (blocks T07–T09)
- Promo stacking, eligibility, and per-customer limits
- Deal expiry behavior (fall back to base plan, or grace period), renewal, and approval workflow

## Tasks

| ID     | Task                                                                                                                              | Level | Status  | Depends  |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- | ----- | ------- | -------- |
| P6-T01 | `promo_campaigns` (reference) and `promo_redemptions` (immutable) schema                                                          | L2    | todo    | —        |
| P6-T02 | Promo code validation at checkout against Stripe, and redemption recording                                                        | L2    | todo    | T01      |
| P6-T03 | Tenant promo code entry in checkout                                                                                               | L1    | todo    | T02      |
| P6-T04 | `platform.enterprise_deals` schema                                                                                                | L2    | todo    | —        |
| P6-T05 | Deal commands: create a deal with a Stripe custom price and invoice subscription, plus entitlement grants for the contract window | L2    | todo    | T04      |
| P6-T06 | Read-time deal validity in entitlement resolution (through grants)                                                                | L2    | todo    | T05      |
| P6-T07 | Referral qualification evaluation (webhook-driven or at read time)                                                                | L2    | blocked | ADR-0035 |
| P6-T08 | Reward fulfilment (grant or Stripe credit)                                                                                        | L2    | blocked | ADR-0035 |
| P6-T09 | Tenant referral page (link, status)                                                                                               | L1    | blocked | ADR-0035 |
| P6-T10 | Integration tests: promo redemption, deal grants, reward idempotency                                                              | L1    | todo    | T02, T06 |

## Exit Criteria

- Discounts are computed only by Stripe.
- Deal and referral access flows through entitlement grants.
- `entitlements` imports neither `deals` nor `referrals`.
