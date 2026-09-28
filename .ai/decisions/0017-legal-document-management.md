# ADR-0017: Legal Document Management and Acceptance

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0018, ADR-0020, ADR-0024

## Context

Terms acceptance must be recorded from the first user. The acceptance check sits in the request pipeline, which makes it expensive to add later.

## Decision

- Documents:
  - `legal_documents` holds document types (for example ToS, Privacy Policy, DPA).
  - `legal_document_versions` holds content per locale, `effective_at`, a `requires_reacceptance` flag, and publish state.
  - Versions are archived, never deleted.
- Acceptances are immutable records:
  - per user: ToS and Privacy Policy
  - per workspace: DPA, accepted by the workspace Owner, with the Owner's user ID recorded
- **Acceptance check.** The request pipeline resolves in this order: identity, then user-level acceptance check, then workspace resolution, then workspace-level acceptance check. Pending acceptances redirect to an acceptance page.
- "Current version" means the latest published version whose `effective_at` is on or before now, evaluated at read time (ADR-0020).
- Owned by the `legal` feature. Versions are managed from platform administration in Phase 7. Placeholder versions are seeded in Phase 3.

## Consequences

- Complete acceptance history, suitable for audit and dispute handling.
- Every derived product must provide its own legal text.
- Locale fallback when a translation is missing is a product decision for Phase 3.

## Alternatives Considered

- Static legal pages with no acceptance tracking: not GDPR-defensible.
