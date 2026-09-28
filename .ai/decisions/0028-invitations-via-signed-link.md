# ADR-0028: Invitations via Signed Link (No Email Provider in v1)

- Status: Accepted (accepted technical debt)
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0005, ADR-0018, ADR-0020

## Context

No email provider is approved. Memberships are database-backed, so Clerk invitations do not apply.

## Decision

- An invitation is a database row with a hashed, single-use token, the target email, the role, and `expires_at` (evaluated at read time).
- The inviter sees a copyable invitation link in the UI.
- Acceptance requires an authenticated user and runs in `tx_accept_invitation`, which performs the seat check and writes the audit entry.
- Invitations can be revoked. Tokens are an ephemeral class (ADR-0018).
- Email delivery is planned for a later version. It requires a new vendor ADR.

## Consequences

- Invitation UX is manual in v1.
- The invitation module is designed so that email delivery can be added as a separate sender without changing acceptance.
- Open security question for Phase 4 (owner decision): must the accepting user's verified email match the invitation email? The recommendation is yes, because otherwise a leaked link grants access to anyone.

## Alternatives Considered

- Clerk invitation emails: Clerk would own one product email.
- Adding Resend now: expands the approved stack.
