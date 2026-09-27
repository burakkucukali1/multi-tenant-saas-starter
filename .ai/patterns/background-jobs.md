# Background Jobs Pattern

## Primary Goal

Move non-interactive work out of request-response cycles.

Maintain:

- Responsiveness
- Reliability
- Scalability
- Fault Tolerance

Users should not wait for background work.

---

# Mental Model

Request

↓

Job Created

↓

Queue

↓

Worker

↓

Processing

↓

Result

Background work should be decoupled from user requests.

---

# Good Candidates

Use background jobs for:

- Emails
- Reports
- Exports
- AI processing
- Webhooks
- File processing
- Notifications
- Billing synchronization

---

# Avoid

Do not use jobs for:

- Immediate authorization
- Critical request validation
- User-facing synchronous actions

Jobs introduce eventual consistency.

---

# Core Principle

Jobs may execute:

- Later
- More than once
- On different machines

Design accordingly.

---

# Idempotency

Jobs must be idempotent.

Bad:

```txt
Send Credits

↓

Credits += 100
```

Retry causes duplication.

Good:

```txt
Check Processing State

↓

Already Processed?

↓

Skip
```

---

# Job Payload

Include only required information.

Example:

```ts
{
  (jobId, tenantId, resourceId);
}
```

Avoid large payloads.

---

# Tenant Awareness

Multi-tenant systems must include:

```ts
{
  tenantId;
}
```

in every job.

Workers must preserve tenant context.

---

# Retry Strategy

Retries are expected.

Use:

- Exponential backoff
- Retry limits
- Failure tracking

Never retry forever.

---

# Failure Handling

Jobs may fail.

Plan for:

- Temporary failures
- Permanent failures
- External outages

Failures should be recoverable.

---

# Dead Letter Queue

After retry exhaustion:

```txt
Job

↓

Failed

↓

Dead Letter Queue
```

Do not silently discard failed jobs.

---

# Scheduling

Use scheduled jobs for:

- Reports
- Cleanup
- Billing sync
- Data aggregation

Scheduled work should be predictable.

---

# Job Ownership

Every job should answer:

Who created this?

Store:

```ts
{
  (tenantId, actorId, createdAt);
}
```

Ownership improves traceability.

---

# Concurrency

Multiple workers may process jobs simultaneously.

Avoid:

- Shared mutable state
- Race conditions
- Non-atomic updates

Assume concurrent execution.

---

# Long Running Jobs

Large jobs should be split.

Bad:

```txt
Process 1,000,000 Records
```

Good:

```txt
Split

↓

Chunk

↓

Process
```

Smaller jobs are easier to recover.

---

# Progress Tracking

Consider tracking:

- Pending
- Running
- Completed
- Failed

For user-visible operations.

---

# Observability

Monitor:

- Queue size
- Processing time
- Retry count
- Failure rate
- Dead letter volume

Background systems require visibility.

---

# Audit Logging

Log:

- Job creation
- Job completion
- Failures
- Retries

Important work should be traceable.

---

# Testing Requirements

Always test:

- Retries
- Duplicate execution
- Worker crashes
- Partial failures
- Dead letter handling

---

# Common Mistakes

Avoid:

- Non-idempotent jobs
- Infinite retries
- Large payloads
- Missing tenant context
- Silent failures
- Long synchronous processing

---

# Review Checklist

Ask:

- Is the job idempotent?
- Is tenant context preserved?
- Are retries safe?
- Are failures recoverable?
- Is observability present?
- Is work appropriately asynchronous?

---

# Mental Model

Background jobs trade immediacy for reliability.

Assume every job may:

- Run late
- Run twice
- Fail unexpectedly

Design accordingly.
