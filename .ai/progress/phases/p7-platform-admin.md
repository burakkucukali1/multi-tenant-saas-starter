# P7 — Platform Administration

- Status: todo
- Depends on: P6
- ADRs: 0009, 0012, 0017, 0018, 0019, 0021, 0032, 0039, 0040

## Goal

A fully isolated platform administration surface covering all required capabilities.

## Scope

Delivered in sub-phases, in order. Each sub-phase is independently shippable.

- **P7a** Platform identity and RBAC, platform admin management
- **P7b** Read surfaces: KPIs, users, workspaces, memberships, audit log, usage analytics
- **P7c** Tenant operations: membership management, ownership transfer, workspace suspend, restore, and purge, user erasure
- **P7d** Commercial operations: subscriptions, plans, enterprise deals, promo codes, referrals
- **P7e** Legal document management

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`, `auth.md`
- Patterns: `.ai/patterns/rbac.md`, `.ai/patterns/audit-logging.md`
- ADR-0012, 0021, 0039, 0040
- P7d adds `.ai/integrations/stripe.md` and `.ai/patterns/billing.md`
- P7b adds `.ai/core/performance.md`

## Open Questions

- ADR-0039 platform roles, bootstrap, MFA, and PII read auditing (blocks P7a)
- ADR-0040 impersonation (blocks P7c scope)
- ADR-0032 purge timing and audit retention (blocks T12)
- Workspace suspension semantics: what a suspended workspace can still do
- KPI definitions: which metrics count as platform KPIs

## Tasks

| ID     | Task                                                                                                                    | Level | Status | Depends       |
| ------ | ----------------------------------------------------------------------------------------------------------------------- | ----- | ------ | ------------- |
| P7-T01 | [a] `platform` schema: admins, roles, permissions, role grants. Registry and CI check                                   | L2    | todo   | ADR-0039      |
| P7-T02 | [a] `platform/access`: `PlatformContext`, pure checks, audited `WorkspaceScope` minting                                 | L2    | todo   | T01           |
| P7-T03 | [a] `(platform)` middleware matcher, MFA enforcement per ADR-0039                                                       | L2    | todo   | T02           |
| P7-T04 | [a] Bootstrap script for the first Super Admin                                                                          | L2    | todo   | T01           |
| P7-T05 | [a] Platform admin management UI                                                                                        | L2    | todo   | T03           |
| P7-T06 | [a] Platform authorization matrix and the tenant/platform mutual exclusion tests                                        | L2    | todo   | T02           |
| P7-T07 | [b] KPI dashboard (on-demand SQL views, request-level caching)                                                          | L1    | todo   | T03           |
| P7-T08 | [b] Users, workspaces, and memberships read models and views                                                            | L1    | todo   | T03           |
| P7-T09 | [b] Audit log viewer (tenant and platform events)                                                                       | L1    | todo   | T03           |
| P7-T10 | [b] Usage analytics (entitlement usage across workspaces)                                                               | L1    | todo   | T03           |
| P7-T11 | [c] Membership management and ownership transfer via platform-minted scope                                              | L2    | todo   | T02           |
| P7-T12 | [c] Workspace suspend, restore, and manual purge. User erasure                                                          | L2    | todo   | T02, ADR-0032 |
| P7-T13 | [d] Subscription management (Stripe-backed)                                                                             | L2    | todo   | T02           |
| P7-T14 | [d] Plan management: create version, archive, entitlements                                                              | L2    | todo   | T02           |
| P7-T15 | [d] Enterprise deal management                                                                                          | L2    | todo   | T02           |
| P7-T16 | [d] Promo campaign management                                                                                           | L2    | todo   | T02           |
| P7-T17 | [d] Referral overview and manual reward actions                                                                         | L2    | todo   | T02, ADR-0035 |
| P7-T18 | [e] Legal document management: versions per locale, publish with `effective_at`, re-acceptance flag, acceptance reports | L2    | todo   | T02           |
| P7-T19 | E2E: platform sign-in, cross-workspace view, audited mutation. A tenant Owner is refused on `(platform)`                | L1    | todo   | T05–T18       |

## Exit Criteria

- A platform admin has no tenant permissions, and vice versa, proven by tests.
- Every platform mutation and scope minting is audited.
- No tenant repository accepts a bypass parameter.
