# ADR-0030: Package Dependency Policy

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0002, ADR-0021

## Context

Every package in the starter is a maintenance liability that every derived product inherits.

## Decision

- The lockfile is committed. Versions are pinned exactly.
- Renovate runs on a weekly schedule. Minor and patch updates are grouped. Major updates get one pull request each.
- Adding a new runtime dependency requires Level 1 approval, with a justification in the pull request covering maintenance, size, and alternatives.
- Adding a new vendor SDK is Level 3 and needs an ADR.
- SDKs are wrapped in `lib/` (ADR-0021).

## Consequences

- Builds are reproducible for derived products, and the dependency surface stays small.
- Merging dependency updates regularly takes some effort.

## Alternatives Considered

- Caret ranges: builds are not reproducible across derived products.
