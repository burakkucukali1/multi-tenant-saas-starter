# ADR-0024: Internationalization

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0006, ADR-0017

## Context

The locale route segment is part of every URL, so adding it later would be expensive.

## Decision

- next-intl with an `app/[locale]` segment from Phase 1.
- Locales: `en` (default) and `tr`.
- Message files are namespaced by feature. CI checks that `en` and `tr` have the same keys.
- Legal document versions are stored per locale (ADR-0017).
- Other user-generated content is not localized in v1.

## Consequences

- Two locales prove the plumbing without much overhead.
- Every UI string needs translation in two files.

## Alternatives Considered

- English only, with i18n added later: that means a routing refactor.
