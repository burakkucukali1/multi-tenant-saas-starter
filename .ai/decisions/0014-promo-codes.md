# ADR-0014: Promo Codes

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0013, ADR-0020

## Context

Promo codes are in architecture scope. Discounts affect money, and money has a single source of truth (ADR-0013).

## Decision

- Stripe Promotion Codes and Coupons determine the actual discount.
- Local data:
  - `promo_campaigns` holds campaign metadata and attribution, linked to Stripe coupon and promotion code IDs. It is archived, never deleted.
  - `promo_redemptions` is immutable. It records which workspace redeemed which code, and when.
- Validity and eligibility are checked against Stripe at checkout. Local windows are evaluated at read time for display.
- Owned by the `promotions` feature. Managed from platform administration in Phase 7.

## Consequences

- Discount math is never reimplemented locally.
- Redemption analytics and audit data live locally.
- Stacking rules, eligibility rules, and per-customer limits are business rules the owner defines in Phase 6.

## Alternatives Considered

- Local-only promo engine: duplicates Stripe logic and risks money errors.
