# Redis Integration Pattern

## Primary Goal

Use Redis as a performance and coordination layer.

Maintain:

- Speed
- Scalability
- Reliability

Redis is an optimization.

Not a source of truth.

---

# Core Principle

Database

↓

Source of Truth

Redis

↓

Performance Layer

Never reverse this relationship.

---

# Recommended Use Cases

- Caching
- Rate Limiting
- Queues
- Distributed Locks
- Session Storage
- Realtime Coordination

---

# Avoid

Do not store critical business data only in Redis.

Redis data may disappear.

---

# Cache Keys

Use explicit names.

Good:

```txt
tenant:{tenantId}:projects
```

Bad:

```txt
projects
```

---

# Tenant Safety

Always include:

```txt
tenantId
```

when caching tenant-owned data.

---

# TTL

Every cache should have a defined expiration strategy.

Avoid permanent caches.

---

# Cache Invalidation

Preferred:

Mutation

↓

Invalidate

↓

Refetch

Never assume cache updates itself.

---

# Rate Limiting

Good use cases:

- Login endpoints
- AI endpoints
- Public APIs

Redis is ideal for counters.

---

# Distributed Locks

Useful for:

- Scheduled jobs
- Billing sync
- Duplicate prevention

Locks should be short-lived.

---

# Queues

Redis may be used for:

- Background jobs
- Delayed jobs
- Event processing

Workers must be idempotent.

---

# Observability

Monitor:

- Memory usage
- Evictions
- Cache hit rate
- Queue depth

---

# Common Mistakes

Avoid:

- Missing TTLs
- Global cache keys
- Using Redis as primary storage

---

# Mental Model

Redis makes systems faster.

The database keeps systems correct.
