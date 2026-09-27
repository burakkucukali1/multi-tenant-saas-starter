# Realtime Pattern

## Primary Goal

Deliver updates with minimal delay while maintaining:

- Consistency
- Reliability
- Scalability

Realtime systems are distributed systems.

Design accordingly.

---

# Mental Model

Event

↓

Transport

↓

Client

↓

State Update

Realtime is event delivery.

Not database synchronization.

---

# Core Principle

Choose the simplest solution that satisfies requirements.

Do not default to WebSockets.

---

# Transport Selection

Polling

↓

SSE

↓

WebSockets

Move right only when requirements justify it.

---

# Polling

Good for:

- Low update frequency
- Simple dashboards
- Status updates

Benefits:

- Simple
- Reliable
- Easy to scale

---

# SSE

Good for:

- One-way updates
- AI streaming
- Notifications
- Activity feeds

Benefits:

- Simpler than WebSockets
- Native browser support

---

# WebSockets

Use for:

- Chat
- Presence
- Collaborative editing
- Multiplayer interactions

Only when bidirectional communication is required.

---

# Event Structure

Recommended:

```ts
{
  (id, type, tenantId, payload, createdAt);
}
```

Events should be explicit.

---

# Tenant Isolation

Realtime events must be tenant-scoped.

Bad:

```txt
project.updated
```

Good:

```txt
tenant:{tenantId}:project.updated
```

Prevent cross-tenant leaks.

---

# Event Ordering

Do not assume events arrive in order.

Networks are unreliable.

Applications should tolerate:

- Delays
- Reordering
- Duplicates

---

# Event IDs

Include unique identifiers.

Example:

```ts
{
  eventId;
}
```

Useful for deduplication.

---

# Reconnection

Connections will fail.

Plan for:

- Reconnects
- Temporary outages
- Device changes

Disconnections are normal.

---

# Reconnection Strategy

Prefer:

```txt
Exponential Backoff
```

Avoid aggressive reconnect loops.

---

# Offline Recovery

Clients should recover state after reconnecting.

Example:

```txt
Reconnect

↓

Fetch Current State

↓

Resume Updates
```

Do not rely solely on missed events.

---

# Presence Systems

Presence is temporary state.

Examples:

- Online
- Offline
- Typing

Presence should expire automatically.

---

# State Synchronization

Prefer:

```txt
Event

↓

Invalidate Cache

↓

Refetch State
```

instead of complex client-side reconciliation.

---

# Scaling

Large systems should avoid:

```txt
Broadcast Everything
```

Use:

- Rooms
- Channels
- Topics
- Tenant scopes

Reduce unnecessary traffic.

---

# Reliability

Events may be:

- Lost
- Delayed
- Duplicated

Applications must tolerate all three.

---

# Observability

Monitor:

- Connection count
- Disconnect rate
- Message throughput
- Delivery failures
- Latency

Realtime systems require visibility.

---

# Testing Requirements

Test:

- Reconnects
- Offline recovery
- Duplicate events
- Event ordering
- Tenant isolation

---

# Common Mistakes

Avoid:

- WebSockets for everything
- Global broadcasts
- Missing reconnection logic
- Assuming event ordering
- Missing tenant isolation

---

# Review Checklist

Ask:

- Is realtime actually required?
- Is the transport appropriate?
- Is tenant isolation enforced?
- Is reconnection handled?
- Is offline recovery supported?
- Are events observable?

---

# Mental Model

Realtime systems deliver events.

The server remains the source of truth.

Events inform clients that state changed.
