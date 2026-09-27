# RBAC Pattern

## Primary Goal

Control access through permissions rather than hardcoded role checks.

Maintain:

- Security
- Flexibility
- Scalability
- Maintainability

Permissions are the source of truth.

Roles are collections of permissions.

---

# Mental Model

User

↓

Membership

↓

Role

↓

Permissions

↓

Resource Access

Roles grant permissions.

Permissions grant access.

---

# Core Principle

Authorization decisions should be permission-based.

Avoid:

```ts
role === "admin";
```

Prefer:

```ts
can("project.delete");
```

Permissions scale better than roles.

---

# Permission Structure

Recommended:

```txt
resource.action
```

Examples:

```txt
project.create
project.read
project.update
project.delete

billing.read
billing.manage

user.invite
user.remove
```

Permission names should be explicit.

---

# Role Structure

Roles are permission bundles.

Example:

```txt
Admin
├─ project.create
├─ project.delete
├─ billing.manage

Member
├─ project.create
├─ project.read

Viewer
├─ project.read
```

Roles should not contain business logic.

---

# Permission Evaluation

Recommended:

```ts
can(permission);
```

Example:

```ts
can("project.delete");
```

Authorization logic should be centralized.

Avoid scattered permission checks.

---

# Authorization Flow

Always verify:

1. Membership exists
2. Tenant matches
3. Permission exists
4. Resource ownership is valid

Permission checks do not replace ownership checks.

---

# Resource Authorization

Permission alone is insufficient.

Bad:

```ts
can("project.update");
```

Good:

```ts
can("project.update");

project.tenantId === tenantId;
```

Ownership must always be validated.

---

# Backend Responsibility

Backend calculates permissions.

Example:

```ts
["project.create", "project.delete", "billing.manage"];
```

Backend is the source of truth.

---

# Frontend Responsibility

Frontend may:

- Hide actions
- Improve UX
- Disable controls

Frontend must not:

- Enforce authorization
- Grant access
- Make security decisions

---

# Permission Storage

Recommended:

```txt
Role

↓

RolePermission

↓

Permission
```

Example:

```ts
Role {
  id
  name
}

Permission {
  id
  key
}

RolePermission {
  roleId
  permissionId
}
```

Avoid hardcoded permission mappings.

---

# Dynamic Permissions

Permissions should be configurable.

Avoid:

```ts
if (role === "admin")
```

Prefer:

```ts
can("billing.manage");
```

Permission systems should support growth.

---

# Permission Caching

Permission calculation may be cached.

Cache keys must include:

```txt
userId
tenantId
```

Example:

```txt
permissions:{userId}:{tenantId}
```

Never share permissions across tenants.

---

# Feature Permissions

Permissions determine actions.

Feature flags determine availability.

Do not mix them.

Bad:

```ts
featureEnabled("billing");
```

for authorization.

Good:

```ts
featureEnabled("billing");

AND;

can("billing.manage");
```

---

# Permission Naming Rules

Use:

```txt
resource.action
```

Avoid:

```txt
admin
superadmin
manager
```

inside authorization logic.

Permission names should describe capabilities.

---

# Hierarchical Permissions

Prefer explicit permissions.

Avoid implicit inheritance when possible.

Bad:

```txt
admin
→ everything
```

Good:

```txt
project.create
project.update
project.delete
billing.manage
```

Explicit permissions are easier to audit.

---

# Auditing

Authorization failures should be auditable.

Record:

- User
- Tenant
- Permission
- Resource
- Timestamp

Example:

```ts
{
  (userId, tenantId, permission, resourceId, createdAt);
}
```

---

# Testing Requirements

Always test:

Allowed User

↓

Success

Forbidden User

↓

Failure

Ownership Violation

↓

Failure

Cross Tenant Access

↓

Failure

---

# Common Mistakes

Avoid:

- role === "admin"
- Client-side authorization
- Missing ownership validation
- Hardcoded permissions
- Global user roles
- Shared permission caches

---

# Review Checklist

Ask:

- Are permissions explicit?
- Is authorization server-side?
- Is ownership validated?
- Are permissions tenant-aware?
- Are permissions centralized?
- Are authorization failures tested?

---

# Mental Model

Roles group permissions.

Permissions authorize actions.

Ownership protects resources.

All three are required.
