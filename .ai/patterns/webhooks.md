# Webhooks Pattern

## Primary Goal

Process external events reliably and safely.

Maintain:

- Reliability
- Idempotency
- Consistency
- Observability

Webhook systems must tolerate:

- Duplicates
- Delays
- Retries
- Out-of-order events

---

# Mental Model

Provider

↓

Webhook Event

↓

Verification

↓

Processing

↓

Business Action

↓

Audit Log

Every webhook is an external system attempting to modify internal state.

Treat webhook payloads as untrusted input.

---

# Core Principle

Webhook delivery is not guaranteed to be:

- Unique
- Ordered
- Immediate

Design accordingly.

---

# Verification

Always verify:

- Signature
- Source authenticity
- Timestamp validity

Never trust unsigned requests.

Reject invalid events immediately.

---

# Source of Truth

The webhook provider remains the source of truth.

Your system receives notifications.

Avoid assuming local state is always correct.

---

# Event Structure

Store:

```ts
{
  (eventId, eventType, provider, payload, receivedAt);
}
```

Persist raw events when possible.

---

# Idempotency

Webhook handlers must be idempotent.

Processing the same event twice should produce the same result.

Bad:

```txt
Payment Received

↓

Balance += amount
```

Duplicate delivery causes incorrect state.

Good:

```txt
Check Event ID

↓

Already Processed?

↓

Skip
```

---

# Event IDs

Track processed events.

Example:

```ts
{
  (eventId, processedAt);
}
```

Never process the same event twice.

---

# Event Ordering

Do not assume delivery order.

Bad:

```txt
subscription.updated

subscription.created
```

may arrive in reverse order.

Systems must tolerate out-of-order events.

---

# State Reconciliation

When event ordering matters:

Fetch current state from the provider.

Prefer authoritative state over event assumptions.

---

# Retries

Providers retry failed deliveries.

Expect:

- Duplicate events
- Delayed events
- Burst retries

Retries are normal behavior.

---

# Failure Handling

Processing failures should not lose events.

Recommended:

```txt
Receive Event

↓

Persist Event

↓

Process Event
```

Persist before processing.

---

# Dead Letter Queue

Failed events should be recoverable.

Recommended:

```txt
Webhook

↓

Processing Failed

↓

Dead Letter Queue
```

Never silently discard events.

---

# Async Processing

Prefer:

```txt
Webhook

↓

Queue

↓

Worker

↓

Business Logic
```

Avoid heavy processing during request handling.

Respond quickly.

---

# Response Strategy

Return success only after:

- Verification
- Persistence

Do not wait for expensive work.

---

# Timeouts

Webhook endpoints should be fast.

Avoid:

- External API chains
- Long calculations
- Large database operations

Move heavy work to background jobs.

---

# Audit Logging

Log:

- Event ID
- Provider
- Event Type
- Processing Status
- Errors

Webhook processing should be traceable.

---

# Security

Never trust:

- Payload contents
- Client headers
- Event ordering

Always verify authenticity.

---

# Observability

Monitor:

- Received events
- Failed events
- Retry rates
- Processing latency
- Dead letter volume

Webhook systems require visibility.

---

# Testing Requirements

Always test:

- Duplicate events
- Invalid signatures
- Retry scenarios
- Out-of-order events
- Failed processing
- Recovery flows

---

# Common Mistakes

Avoid:

- Missing signature verification
- Missing idempotency
- Assuming event order
- Processing before persistence
- Synchronous heavy work
- Silent failures

---

# Review Checklist

Ask:

- Is signature verification present?
- Is processing idempotent?
- Are events persisted?
- Are retries handled?
- Is ordering assumed?
- Are failures recoverable?
- Is processing observable?

---

# Mental Model

Webhook systems are distributed systems.

Assume:

- Events can be duplicated
- Events can be delayed
- Events can arrive out of order

Build for reliability first.
