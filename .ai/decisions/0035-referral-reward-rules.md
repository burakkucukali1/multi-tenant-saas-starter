# ADR-0035: Referral Reward Rules

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 6
- Related: ADR-0016

## Context

Attribution capture is decided (ADR-0016). How rewards are paid out is not.

## Options

1. **Entitlement grant** (`source = referral`) with a validity window, for example a free period or extra seats.
   - No money movement.
   - The value can't be expressed as currency.
2. **Stripe customer balance credit.**
   - Monetary and simple for users to understand.
   - Affects revenue accounting.

## Questions

- Who is rewarded: the referrer, the referee, or both?
- What qualifies a referral (sign-up, first paid invoice, a minimum paid period)?
- Caps and fraud controls.
- Is the reward per user or per workspace?

## Decision

Pending owner decision.
