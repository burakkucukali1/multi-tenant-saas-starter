# ADR-0015: Enterprise Deals

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0009, ADR-0013

## Context

Enterprise customers need custom pricing, custom entitlements, and contract terms that differ from self-serve plans.

## Decision

- Deals are billed through **Stripe invoices with custom prices**, with invoice-based collection.
- `platform.enterprise_deals` records the workspace, contract window, the Stripe price and subscription references, and internal notes. It lives in the `platform` schema.
- Custom entitlements are expressed as `entitlement_grants` with `source = deal` and the contract's validity window. They are created through the `entitlements` API.
- Deal expiry is evaluated at read time (ADR-0020). Nothing mutates on a schedule.
- Owned by the `deals` feature. Created and managed only from platform administration.

## Consequences

- No special plan model for enterprise customers.
- Stripe sends the invoice emails, which works without an email provider.
- Renewal handling, the behavior when a deal expires (fall back to base plan, or grace period), and approval workflow are business rules for Phase 6.

## Alternatives Considered

- Off-platform contracts: loses billing visibility and automation.
- One custom plan per deal: pollutes the plan catalog.
