# P1 — App Shell: i18n, Design System, Branding

- Status: todo
- Depends on: P0
- ADRs: 0003, 0006, 0023, 0024, 0037

## Goal

Lock in the route structure, the locale segment, and the token layer before any feature consumes them.

## Scope

- `app/[locale]` with the `(public)`, `(tenant)`, and `(platform)` route groups (empty shells)
- Brand config, tokens, Tailwind mapping, and base `shared/ui` primitives
- Providers (TanStack Query, next-intl)

Out of scope: authentication, data access, feature UI.

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`, `nextjs.md`
- ADR-0023, ADR-0024, ADR-0037

## Open Questions

- ADR-0037 UI primitive base and color modes (blocks T04–T06)

## Tasks

| ID     | Task                                                                                                       | Level | Status | Depends  |
| ------ | ---------------------------------------------------------------------------------------------------------- | ----- | ------ | -------- |
| P1-T01 | next-intl setup: `en` default, `tr`, locale middleware, feature-namespaced message layout                  | L1    | done   | —        |
| P1-T02 | i18n key parity check in CI                                                                                | L1    | todo   | T01      |
| P1-T03 | Route group skeletons: `(public)`, `(tenant)/t/[workspaceSlug]`, `(platform)/admin`                        | L1    | todo   | T01      |
| P1-T04 | `lib/config/brand.ts`: app name, logo, colors, gradients, typography, radius                               | L1    | todo   | ADR-0037 |
| P1-T05 | Tokens as CSS variables, Tailwind theme mapping, and color modes per ADR-0037                              | L1    | todo   | T04      |
| P1-T06 | Base `shared/ui` primitives (button, input, form field, card, dialog, dropdown, toast, table, empty state) | L1    | todo   | T05      |
| P1-T07 | Layout shells for public, tenant, and platform surfaces that consume brand config                          | L1    | todo   | T03, T06 |
| P1-T08 | TanStack Query provider and conventions                                                                    | L1    | todo   | T03      |
| P1-T09 | Token contract test                                                                                        | L0    | todo   | T05      |

## Exit Criteria

- Changing `brand.ts` rebrands every shell without touching other files.
- Both locales render every shell.
- No raw colors outside the token layer.
