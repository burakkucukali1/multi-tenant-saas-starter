# ADR-0002: Technology Stack

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0005, ADR-0007, ADR-0013, ADR-0034

## Context

The starter needs a stack that works well for full-stack TypeScript, is widely known, and lets AI agents be productive.

## Decision

| Concern                    | Choice                                                |
| -------------------------- | ----------------------------------------------------- |
| Framework                  | Next.js 16.3.6 (ADR-0034)                             |
| Language                   | TypeScript, strict mode                               |
| Styling                    | Tailwind CSS                                          |
| Identity                   | Clerk (ADR-0005)                                      |
| Database                   | Supabase PostgreSQL (ADR-0007)                        |
| Data access                | Supabase client and generated types, no ORM           |
| Client server-state        | TanStack Query                                        |
| i18n                       | next-intl (ADR-0024)                                  |
| Billing                    | Stripe (ADR-0013)                                     |
| Unit and integration tests | Jest                                                  |
| E2E tests                  | Playwright                                            |
| Formatting                 | Prettier with `@trivago/prettier-plugin-sort-imports` |
| Node.js                    | 24.21.0 Active LTS (ADR-0034)                         |
| Package manager            | pnpm 12.6.0 (ADR-0034)                                |

Out of scope for v1: background job systems, email providers, error tracking, file storage, analytics vendors, AI providers.

## Consequences

- Every derived product inherits this stack. Adding a vendor to the starter is a Level 3 decision.
- Without a queue, anything time-based has to be designed for read-time evaluation (ADR-0020).

## Alternatives Considered

The stack was selected by the project owner. This ADR records it and does not re-evaluate it.
