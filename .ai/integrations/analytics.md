# Analytics Integration Pattern

## Primary Goal

Collect product insights without affecting business logic.

---

# Core Principle

Analytics is optional.

Business operations must work even if analytics fails.

---

# Event Naming

Use:

```txt
entity_action
```

Examples:

```txt
project_created
user_invited
subscription_upgraded
```

---

# Tracking Layer

Application

↓

Analytics Service

↓

Provider

Avoid direct provider calls.

---

# Reliability

Analytics failures should not block users.

Bad:

Analytics Failure

↓

Signup Fails

Good:

Analytics Failure

↓

Logged

↓

Signup Continues

---

# Privacy

Never send:

- Passwords
- Tokens
- Secrets
- Sensitive Information

---

# Observability

Track:

- Event Volume
- Delivery Failures
- Missing Events

---

# Common Mistakes

Avoid:

- Business logic dependency
- Tracking everything
- Sensitive data leakage

---

# Mental Model

Analytics explains behavior.

It should never control behavior.
