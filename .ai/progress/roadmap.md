# Roadmap

Rules: ADR-0027.

- Task status lives only in the phase files.
- This index changes only when a phase opens or closes, or when the pointer moves.
- Open decisions live only in Proposed ADRs.

## Architecture Planning

- Status: **complete** (2026-09-28)
- Readiness: [readiness-assessment.md](readiness-assessment.md)

## Current Position

- Phase: **P0 — Foundations** (implementation)
- Next task: **P0-T12**
- Non-critical for early P0: ADR-0036 (production hosting and recovery; dev/CI Supabase per ADR-0041)

## Phases

| Phase | Name                                             | Status      | File                                                            |
| ----- | ------------------------------------------------ | ----------- | --------------------------------------------------------------- |
| P0    | Foundations: docs, tooling, CI                   | in-progress | [p0-foundations.md](phases/p0-foundations.md)                   |
| P1    | App shell: i18n, design system, branding         | todo        | [p1-app-shell.md](phases/p1-app-shell.md)                       |
| P2    | Data foundation                                  | todo        | [p2-data-foundation.md](phases/p2-data-foundation.md)           |
| P3    | Identity, legal acceptance, referral capture     | todo        | [p3-identity.md](phases/p3-identity.md)                         |
| P4    | Tenancy and RBAC                                 | todo        | [p4-tenancy-rbac.md](phases/p4-tenancy-rbac.md)                 |
| P5    | Catalog, billing, entitlements                   | todo        | [p5-billing-entitlements.md](phases/p5-billing-entitlements.md) |
| P6    | Commercial: promo codes, deals, referral rewards | todo        | [p6-commercial.md](phases/p6-commercial.md)                     |
| P7    | Platform administration                          | todo        | [p7-platform-admin.md](phases/p7-platform-admin.md)             |
| P8    | Hardening and starter templating                 | todo        | [p8-hardening.md](phases/p8-hardening.md)                       |

## Phase Ordering Rationale

- The things that are most expensive to retrofit come first: route structure, tokens, data access, and the request pipeline.
- P3 captures legal acceptance and referral attribution because that data cannot be recovered later.
- P4 combines tenancy and RBAC because invitations need permissions.
- P7 comes last because it depends on everything before it.

## Open Decisions

See the Proposed section in [`.ai/decisions/index.md`](../decisions/index.md).
