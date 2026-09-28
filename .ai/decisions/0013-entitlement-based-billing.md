# ADR-0013: Entitlement-Based Billing with Stripe

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0014, ADR-0015, ADR-0016, ADR-0020, ADR-0021

## Context

Features and limits must be controlled by entitlements rather than by checks on plan names. Enterprise deals, referral rewards, and manual grants all need per-workspace overrides. Stripe is the billing provider.

## Decision

- **Stripe is the source of truth** for customers, subscriptions, prices, discounts, and invoices. The database mirrors the state it needs through idempotent webhooks. Processed event IDs are stored as ephemeral records.
- The billing owner is the workspace, with one Stripe customer per workspace.
- **Plans are data.**
  - `plans` are versioned and archived, never deleted.
  - `plan_entitlements` define feature flags and numeric limits per plan version.
  - Entitlement keys are a typed registry in code, validated against seed data in CI.
- **Entitlement grants.**
  - `entitlement_grants` is owned by the `entitlements` feature.
  - Each grant has workspace, key, value, source (`deal`, `referral`, `manual`), `valid_from`, and `valid_until`.
  - Other features create grants only through the `entitlements` public API.
- **Resolution** is a pure function of plan entitlements, the active grants at read time, and current usage. The result is resolved once per request into the tenant context.
- Starter usage meter: seats, derived from active memberships. Derived products add their own meters.
- Enforcement: `requireEntitlement` and `assertWithinLimit` guards, called at entry points and workflows, never in repositories.
- Workflows that span subscriptions and entitlements (checkout, plan change, downgrade validation) live in `workflows/` (ADR-0021).

## Consequences

- Enterprise deals and rewards need no schema change to the plan model.
- Webhook ordering and retries must be handled. Handlers upsert by Stripe object ID and ignore stale events.
- Open business questions for Phase 5: trials, behavior when payment fails (hard block or grace period), use of the Stripe Customer Portal, and tax and currency handling.

## Alternatives Considered

- Plan-name checks in code: every pricing change becomes a code change.
- Database as the billing source of truth: duplicates Stripe and drifts from it.
