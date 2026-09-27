# Resend Integration Pattern

## Primary Goal

Provide reliable transactional email delivery.

---

# Core Principle

Email is communication.

Not application state.

---

# Recommended Flow

Business Event

↓

Background Job

↓

Resend

↓

Email Delivery

Avoid sending emails inside requests.

---

# Email Categories

Examples:

- Verification
- Invitations
- Password Reset
- Billing
- Notifications

---

# Idempotency

Email jobs may retry.

Prevent duplicate sends where required.

---

# Templates

Use centralized templates.

Avoid inline email generation.

---

# Observability

Track:

- Sent
- Delivered
- Failed

---

# Common Mistakes

Avoid:

- Synchronous sending
- Business logic in templates
- Missing retry handling

---

# Mental Model

Email delivery is asynchronous.
