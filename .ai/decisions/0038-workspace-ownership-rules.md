# ADR-0038: Workspace Ownership Rules

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 4
- Related: ADR-0011

## Context

Ownership transfer is required, but the ownership invariants have not been defined.

## Questions

- Exactly one Owner per workspace, or one or more?
- Can the Owner leave the workspace, or be removed, without transferring ownership first?
- Must the transfer target already be a member? Which role do they get, and what role does the previous Owner get afterwards?
- Does the transfer need acceptance by the target?
- Who owns the billing relationship and the DPA acceptance after a transfer?
- Are workspace slugs editable after creation (ADR-0006)?

## Recommendation

- Exactly one Owner.
- The Owner cannot leave or be removed without transferring first.
- The transfer target must be an existing member.
- The previous Owner becomes Admin.
- The transfer is immediate, with no acceptance step.

Enforce the single-Owner rule with a partial unique index and inside `tx_transfer_ownership`.

## Decision

Pending owner decision.
