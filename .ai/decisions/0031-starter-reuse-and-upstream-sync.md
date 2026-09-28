# ADR-0031: Starter Reuse and Upstream Sync

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 8 (the conflict-surface rules apply from Phase 1)

## Context

Derived products will start from this repository. The question is whether fixes to the starter should flow into them afterwards.

## Options

1. **Template repository plus an `upstream` remote.** Derived products periodically merge tagged starter releases.
   - Fixes propagate.
   - Requires discipline: product-specific changes stay in a small conflict surface (`lib/config/*`, `messages/`, `.env`, product migrations, product modules).
2. **One-time copy.** No upstream link.
   - Simplest.
   - Fixes never propagate, and every derived product forks for good.

## Recommendation

Option 1. The confined conflict surface already follows from ADR-0023 and ADR-0021, so the extra cost is small.

## Decision

Pending owner approval.
