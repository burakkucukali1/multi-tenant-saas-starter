# ADR-0022: Recursion Prevention

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0011, ADR-0019, ADR-0020, ADR-0021

## Context

Circular dependencies, recursive service chains, recursive event chains, and recursive authorization chains are explicitly prohibited.

## Decision

| Recursion class | Structural prevention                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencies    | Rank-ordered imports and cycle detection in CI (ADR-0021)                                                                                     |
| Services        | A module calls only lower-ranked modules. Workflows never call workflows                                                                      |
| Authorization   | Flat roles, a permission set resolved once per request, pure `can()`, and no authorization inside repositories (ADR-0011)                     |
| Context         | Tenant and platform contexts are resolved once per request and never re-resolved deeper                                                       |
| Events          | No in-process event bus. No queue in v1. Webhook handlers call features or workflows and never emit further events                            |
| Database        | No triggers that write to other tables. `tx_*` functions never call other `tx_*` functions (ADR-0008). Audit is written explicitly (ADR-0019) |
| Time            | No scheduled mutations (ADR-0020)                                                                                                             |

## Consequences

- Every call graph is a tree and can be understood from its entry point.
- Some route and workflow code is longer, and some queries are duplicated. That is accepted in exchange for a legible graph.

## Alternatives Considered

- Convention-only rules: violated within months.
