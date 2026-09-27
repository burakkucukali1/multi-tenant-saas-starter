# Audit Logging Pattern

## Primary Goal

Provide traceability for critical business actions.

Maintain:

- Accountability
- Compliance
- Security
- Debuggability

Audit logs explain:

Who did what, when, and to which resource.

---

# Mental Model

Actor

↓

Action

↓

Resource

↓

Timestamp

↓

Audit Record

Audit logs are historical records.

They should be immutable.

---

# Core Principle

Audit logs are evidence.

Not application state.

Never use audit logs as the source of truth.

---

# What To Audit

Always audit:

- Permission changes
- Billing changes
- Subscription changes
- User invitations
- Workspace deletion
- Authentication events
- Administrative actions

Focus on high-impact actions.

---

# Recommended Structure

```ts
{
  (id,
    tenantId,
    actorId,
    action,
    resourceType,
    resourceId,
    metadata,
    createdAt);
}
```

---

# Action Naming

Use:

```txt
resource.action
```

Examples:

```txt
user.invited
project.deleted
billing.updated
role.changed
```

---

# Tenant Context

Audit entries should include:

```ts
tenantId;
```

Multi-tenant systems require tenant-aware auditing.

---

# Metadata

Store relevant context.

Example:

```ts
{
  previousRole: "member",
  newRole: "admin"
}
```

Avoid excessive payloads.

---

# Immutability

Audit records should never be modified.

Avoid:

```txt
UPDATE audit_log
```

Historical records must remain trustworthy.

---

# Sensitive Data

Never store:

- Passwords
- Tokens
- Secrets
- Payment details

Audit safely.

---

# Retention

Define retention policies.

Examples:

- 90 days
- 1 year
- 7 years

Based on business requirements.

---

# Querying

Common filters:

- Actor
- Resource
- Action
- Tenant
- Date Range

Design indexes accordingly.

---

# Observability

Audit logs are not monitoring.

Audit logs answer:

"What happened?"

Monitoring answers:

"What is happening?"

---

# Testing Requirements

Verify:

- Critical actions are logged
- Tenant context exists
- Actor context exists
- Sensitive data is excluded

---

# Common Mistakes

Avoid:

- Mutable audit logs
- Missing actor information
- Missing tenant context
- Logging secrets
- Using audit logs as application state

---

# Review Checklist

Ask:

- Is the action auditable?
- Is actor information recorded?
- Is tenant context recorded?
- Is sensitive data excluded?
- Are records immutable?

---

# Mental Model

If a customer asks:

"Who changed this?"

Audit logs should answer immediately.
