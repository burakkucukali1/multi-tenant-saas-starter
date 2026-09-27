# Notifications Pattern

## Primary Goal

Inform users about important events.

Maintain:

- Relevance
- Reliability
- Deliverability
- User Control

Notifications are communication.

Not application state.

---

# Mental Model

Event

↓

Notification

↓

Delivery Channel

↓

User

Notifications are derived from business events.

---

# Core Principle

Business events are the source of truth.

Notifications are generated from events.

---

# Delivery Channels

Common channels:

- In-app
- Email
- Push
- SMS

Channels are delivery mechanisms.

Not business logic.

---

# Event-Based Design

Recommended:

```txt
Project Created

↓

Notification Created

↓

Delivery
```

Avoid coupling business actions to delivery logic.

---

# Notification Model

```ts
{
  (id, tenantId, userId, type, payload, readAt, createdAt);
}
```

---

# Read State

Track:

```txt
Unread

↓

Read
```

Keep read state separate from delivery state.

---

# Delivery State

Examples:

```txt
Pending

Sent

Failed
```

Track independently.

---

# Preferences

Users should control:

- Channels
- Frequency
- Categories

Preferences improve signal quality.

---

# Batching

Consider batching for:

- Activity digests
- Reports
- Summaries

Avoid notification spam.

---

# Priority Levels

Examples:

```txt
Critical

High

Normal

Low
```

Not all events deserve interruption.

---

# Rate Limiting

Protect users from:

- Notification floods
- Infinite loops
- Repeated failures

---

# Multi-Tenant

Notifications should include:

```ts
tenantId;
```

Context must be preserved.

---

# Background Jobs

Use jobs for:

- Email delivery
- Push delivery
- Retries

Avoid synchronous delivery.

---

# Observability

Track:

- Delivery rate
- Failure rate
- Open rate
- Read rate

---

# Testing Requirements

Verify:

- Notification creation
- Delivery
- Preferences
- Read state
- Tenant isolation

---

# Common Mistakes

Avoid:

- Spam
- Business logic in delivery layer
- Missing preferences
- Synchronous email sending

---

# Review Checklist

Ask:

- Is notification derived from an event?
- Are preferences respected?
- Is delivery asynchronous?
- Is tenant context preserved?
- Are retries handled?

---

# Mental Model

Events create notifications.

Notifications inform users.

They should never become the source of truth.
