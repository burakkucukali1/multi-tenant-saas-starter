# ADR-0016: Referrals

- Status: Accepted (reward rules pending, ADR-0035)
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0013, ADR-0035

## Context

Referral attribution must be captured at sign-up. If it is not, historical referrals are permanently lost. Reward rules are not yet defined.

## Decision

- Every user gets a referral code at provisioning (`referral_codes`, owned by the user).
- **Capture in Phase 3.**
  - A referral code in the sign-up URL is stored in a short-lived, HTTP-only cookie.
  - At provisioning, it is persisted to `referral_attributions`, which is immutable (referee, code, captured time).
- Reward fulfilment is designed to use either an entitlement grant (`source = referral`) or a Stripe customer balance credit. The choice is made in ADR-0035.
- Qualification (for example, "referee paid their first invoice") is evaluated from Stripe webhooks or at read time, never by a scheduled job.
- Owned by the `referrals` feature.

## Consequences

- Attribution is correct from day one, whatever reward rules are chosen later.
- Fraud controls are business rules for Phase 6.

## Alternatives Considered

- Building referrals entirely later: loses attribution for early users.
