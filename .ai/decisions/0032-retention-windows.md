# ADR-0032: Retention Windows

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 4 (workspace deletion grace period). Phase 7 (purge and audit retention)

## Context

ADR-0018 defines lifecycle classes but not their durations. These values are compliance and product decisions.

## Values Required

| Item                              | Recommendation                      | Reasoning                                                                                                   |
| --------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Workspace deletion grace period   | 30 days                             | Common expectation. Fits within the GDPR one-month erasure deadline only if the purge is triggered promptly |
| Membership soft-delete retention  | Until workspace purge               | Keeps membership history for audit                                                                          |
| User erasure after Clerk deletion | Immediate pseudonymization          | Satisfies GDPR without waiting                                                                              |
| Audit log retention               | Owner-defined, 1 to 7 years typical | Depends on contractual and compliance needs                                                                 |
| Invitation expiry                 | 7 days                              | Limits exposure if a link leaks                                                                             |

## Decision

Pending owner approval.
