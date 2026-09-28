# ADR-0029: No Error Tracking in v1

- Status: Accepted (accepted technical debt)
- Date: 2026-09-27
- Approval level: L3

## Context

No observability vendor is approved. Every derived product inherits this gap.

## Decision

- v1 relies on host platform logs.
- Structured server-side logging goes through a single `lib` logger, so adding an error tracking vendor later touches one module.
- Logs must never contain PII, tokens, or secrets.

## Consequences

- Production failures are harder to detect and diagnose.
- Adding a vendor later is cheap because logging is centralized.

## Alternatives Considered

- Sentry or OpenTelemetry now: expands the approved stack.
