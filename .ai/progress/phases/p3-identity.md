# P3 — Identity, Legal Acceptance, Referral Capture

- Status: todo
- Depends on: P1, P2
- ADRs: 0005, 0016, 0017, 0018, 0020

## Goal

Authenticated, provisioned users who have accepted the current legal terms, with referral attribution captured from the first sign-up.

## Scope

- Clerk through `lib/auth`, sign-in and sign-up pages, middleware
- `users`, just-in-time provisioning, Clerk webhooks, identity context
- `legal_documents`, `legal_document_versions`, user-level acceptances, and the acceptance check
- `referral_codes` and `referral_attributions` capture

Out of scope: workspace-level DPA acceptance (P4), legal document admin UI (P7), referral rewards (P6).

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`, `auth.md`
- Integration: `.ai/integrations/clerk.md`
- Pattern: `.ai/patterns/webhooks.md`
- ADR-0005, 0016, 0017

## Open Questions

- Locale fallback for legal versions with a missing translation (ADR-0017)
- Initial legal document set: confirm ToS and Privacy Policy as the user-level documents

## Tasks

| ID     | Task                                                                                      | Level | Status | Depends  |
| ------ | ----------------------------------------------------------------------------------------- | ----- | ------ | -------- |
| P3-T01 | `lib/auth` Clerk adapter, middleware, and sign-in and sign-up pages in `(public)`         | L2    | todo   | —        |
| P3-T02 | `users` table (lifecycle class) and just-in-time provisioning                             | L2    | todo   | T01      |
| P3-T03 | Identity context, resolved once per request                                               | L2    | todo   | T02      |
| P3-T04 | Clerk webhook handler: signature verification, idempotency table, `user.updated` sync     | L2    | todo   | T02      |
| P3-T05 | `user.deleted` hook into user pseudonymization. The full erasure workflow comes in P4     | L2    | todo   | T04      |
| P3-T06 | Legal schema: documents, versions per locale, user acceptances (immutable)                | L2    | todo   | —        |
| P3-T07 | Seed placeholder ToS and Privacy Policy versions (`en`, `tr`)                             | L1    | todo   | T06      |
| P3-T08 | User-level acceptance check in the request pipeline, and the acceptance page              | L2    | todo   | T03, T06 |
| P3-T09 | Referral code generation at provisioning                                                  | L2    | todo   | T02      |
| P3-T10 | Referral attribution capture (cookie, then an immutable attribution at provisioning)      | L2    | todo   | T09      |
| P3-T11 | E2E: sign up, accept terms, reach onboarding. With referral link, attribution is recorded | L1    | todo   | T08, T10 |

## Exit Criteria

- No authenticated request reaches app content without a current acceptance.
- Attribution is persisted for referred sign-ups.
- Webhook handlers pass replay tests (idempotency).
