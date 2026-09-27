# Multi-Tenant Pattern

## Primary Goal

Safely isolate customer data while allowing multiple tenants to share the same application infrastructure.

Maintain:

- Security
- Isolation
- Scalability
- Operational simplicity

Tenant isolation is non-negotiable.

---

# Mental Model

User

↓

Membership

↓

Tenant

↓

Role

↓

Permissions

↓

Resources

Users belong to tenants through memberships.

Resources belong to tenants.

Permissions are evaluated within a tenant.

---

# Core Principle

Every resource must have a clear owner.

Examples:

Project
→ Tenant

Invoice
→ Tenant

Document
→ Tenant

Conversation
→ Tenant

API Key
→ Tenant

Ownership must always be explicit.

---

# Tenant Resolution

Tenant context must be resolved on the server.

Common approaches:

- Subdomain
- URL segment
- Active workspace
- Session context

Never trust client-provided tenant identifiers.

Bad:

```ts
POST / projects;

{
  tenantId: "tenant-a";
}
```

Good:

```ts
const tenantId = session.activeTenantId;
```

Server determines tenant context.

---

# Membership Model

Recommended:

```ts
{
  (userId, tenantId, roleId);
}
```

Membership grants access.

Users do not directly own permissions.

---

# Resource Ownership

Every entity should answer:

Who owns this?

Examples:

Project
→ Tenant

Document
→ Tenant

Invoice
→ Tenant

Conversation
→ Tenant

Membership
→ User + Tenant

Ownership should always be explicit.

---

# Tenant Isolation

Tenant A must never access Tenant B data.

Every query must be tenant-scoped.

Example:

```ts
where: {
  tenantId;
}
```

Never perform unscoped queries.

---

# Resource Access Flow

Always verify:

1. Membership exists
2. Tenant matches
3. Permission exists
4. Resource belongs to tenant

Missing any step is a security risk.

---

# Ownership Validation

Never trust resource identifiers alone.

Bad:

```ts
const project = await getProject(projectId);
```

Good:

```ts
const project = await getProject({
  id: projectId,
  tenantId,
});
```

Ownership must always be validated.

---

# Cross-Tenant Protection

Protect against:

- URL manipulation
- Resource enumeration
- Direct API access
- Background job leakage
- Cache leakage

Assume attackers know resource IDs.

---

# Shared Resources

Avoid shared resources when possible.

If shared resources are required:

Define ownership explicitly.

Example:

```txt
Organization
└─ Project
   └─ Document
```

Ownership hierarchy must be clear.

---

# Tenant Switching

Users may belong to multiple tenants.

Maintain:

- Active tenant
- Available memberships

Switching tenants must never grant additional permissions.

Permissions are evaluated per tenant.

---

# Recommended Data Model

```txt
User

↓

Membership

↓

Tenant

↓

Role

↓

Permission
```

Avoid:

```txt
User
└─ role
```

Roles are tenant-specific.

---

# Query Rules

Every tenant-owned query should include tenant scope.

Bad:

```ts
db.projects.findMany();
```

Good:

```ts
db.projects.findMany({
  where: {
    tenantId,
  },
});
```

Tenant scope should be automatic whenever possible.

---

# Cache Isolation

Cache keys must include tenant context.

Bad:

```txt
projects
```

Good:

```txt
projects:{tenantId}
```

Prevent cache leakage between tenants.

---

# Background Jobs

Jobs must preserve tenant context.

Include:

```ts
{
  tenantId,
  jobId,
}
```

Never process tenant-owned data without tenant information.

---

# Realtime Systems

Realtime events must be tenant-scoped.

Bad:

```txt
project.updated
```

Good:

```txt
tenant:{tenantId}:project.updated
```

Never broadcast tenant data globally.

---

# Audit Logging

Include tenant information in:

- Audit logs
- Security logs
- Billing events
- Background jobs

Example:

```ts
{
  tenantId,
  userId,
  action,
  createdAt,
}
```

Tenant context should always be traceable.

---

# Billing Ownership

Billing belongs to tenants.

Not users.

Good:

```txt
Tenant
└─ Subscription
```

Bad:

```txt
User
└─ Subscription
```

for collaborative SaaS products.

---

# Feature Flags

Feature flags should be tenant-aware.

Example:

```txt
tenantId
+
feature
+
enabled
```

Feature availability should not bypass authorization.

---

# Testing Requirements

Always test:

- Tenant isolation
- Resource ownership
- Membership validation
- Permission enforcement
- Cache isolation
- Cross-tenant access attempts

Assume isolation is broken until proven otherwise.

---

# Common Mistakes

Avoid:

- Global user roles
- Unscoped queries
- Client-provided tenant IDs
- Missing ownership checks
- Shared cache keys
- Tenant-unaware background jobs
- Tenant-unaware realtime events

---

# Review Checklist

Ask:

- Is ownership explicit?
- Is tenant resolution server-side?
- Are queries tenant-scoped?
- Are resources tenant-owned?
- Are permissions tenant-aware?
- Are cache keys tenant-aware?
- Are jobs tenant-aware?
- Are realtime events tenant-aware?

---

# Mental Model

Multi-tenancy is fundamentally an ownership problem.

Every request should answer:

"Which tenant owns this?"

If ownership cannot be determined, access should be denied.
