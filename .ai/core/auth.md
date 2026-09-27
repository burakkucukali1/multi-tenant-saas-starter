# Authentication & Authorization Playbook

## Golden Rule

Authentication
→ Middleware

Authorization
→ Server

Interactivity
→ Client

Never mix responsibilities.

---

# Authentication

Authentication answers:

```txt
Who is this user?
```

Examples:

- Is the user logged in?
- Is the session valid?
- Is the token valid?

Authentication does NOT answer:

```txt
Can the user access this resource?
```

That is authorization.

---

# Authorization

Authorization answers:

```txt
Can this user perform this action?
```

Examples:

- Can edit project?
- Can delete invoice?
- Can manage workspace?
- Can access billing?

Authorization is always enforced on the server.

---

# Session Architecture

Preferred flow:

Login
↓
Auth Provider
↓
HttpOnly Cookie
↓
Browser stores cookie
↓
Browser sends cookie automatically
↓
Server validates session

---

# Cookie Strategy

Prefer:

- HttpOnly
- Secure
- SameSite=Lax

Example:

```http
Set-Cookie:
session=token;
HttpOnly;
Secure;
SameSite=Lax
```

---

# Why HttpOnly

Benefits:

- JavaScript cannot access token
- Reduces XSS risk
- Works with SSR
- Works with Middleware
- Works with Server Components

Never store sensitive session tokens in localStorage.

Prefer HttpOnly cookies.

---

# User Resolution

Resolve current user on the server.

Preferred:

```tsx
const user = await getUser();
```

Avoid:

```tsx
useQuery(["me"]);
```

everywhere.

Resolve once.

Pass down where needed.

---

# Authentication Responsibilities

Middleware may:

- Read cookies
- Validate session
- Validate token
- Redirect unauthenticated users
- Resolve tenant
- Apply locale rules

Middleware should not:

- Query permissions
- Run business logic
- Run heavy database queries

---

# Authorization Responsibilities

Authorization belongs in:

- Server Components
- Server Actions
- Route Handlers
- Backend Services

Never trust client-side authorization.

---

# Client-Side Checks

Example:

```tsx
{
  isAdmin && <DeleteButton />;
}
```

This improves UX.

This does NOT provide security.

Always validate permissions on the server.

---

# Permission Checks

Bad:

```tsx
if (role === "admin")
```

Prefer:

```tsx
can("project.delete");
```

Permission-based checks scale better than role checks.

---

# Role vs Permission

Role:

Business meaning.

Examples:

- Admin
- Owner
- Member
- Viewer

Permission:

Actual capability.

Examples:

- project.create
- project.delete
- billing.manage
- workspace.invite

Permissions should drive authorization decisions.

---

# RBAC

Preferred model:

User
↓
Role
↓
Permissions

Permission checks should be performed using permissions.

Not roles.

---

# Multi-Tenant Systems

Do not assume:

```txt
user.role
```

is enough.

A user may belong to multiple tenants.

Example:

Workspace A:
Admin

Workspace B:
Viewer

Workspace C:
Editor

Role is tenant-specific.

---

# Recommended Multi-Tenant Model

User
↓
Membership
↓
Tenant
↓
Role
↓
Permissions

Permission evaluation should consider:

User + Tenant + Role

---

# Membership Table Pattern

Membership:

- userId
- tenantId
- roleId

Role:

- name
- permissions

Permissions:

- project.create
- project.delete
- billing.manage

This is the standard SaaS approach.

---

# Frontend Permission Strategy

Frontend should not calculate permissions.

Backend should produce permission set.

Example:

```ts
permissions: ["project.create", "project.delete"];
```

Frontend consumes:

```ts
can("project.delete");
```

---

# Backend Permission Strategy

Backend remains source of truth.

Every protected operation validates permission again.

Never trust frontend checks.

---

# Permission Caching

Permissions may be loaded during login.

Stored in:

- Session
- Token
- Server cache

Avoid querying permissions on every UI render.

---

# Route Protection

Authentication:

```txt
Is user logged in?
```

Middleware

Authorization:

```txt
Can user access resource?
```

Server

Keep these concerns separate.

---

# Resource Access Pattern

Example:

```tsx
const project = await getProject(projectId);

const canAccess = await checkPermission(user.id, project.id);

if (!canAccess) {
  notFound();
}
```

Always validate resource access on the server.

---

# Tenant Resolution

Tenant may come from:

- Subdomain
- Route
- Header
- Session

Examples:

acme.app.com

↓

tenant = acme

Middleware may resolve tenant.

Authorization still happens later.

---

# Security Principles

Never trust:

- Browser state
- Hidden buttons
- Disabled inputs
- Client validation

Always validate on the server.

---

# Auditability

Sensitive actions should be auditable.

Examples:

- Permission changes
- Billing changes
- User invitations
- Workspace deletion

Consider audit logging.

---

# Authentication Review Checklist

- Are sessions HttpOnly?
- Is auth handled in middleware?
- Is authorization handled on server?
- Are permissions used instead of roles?
- Is frontend treated as untrusted?
- Is multi-tenant support correct?
- Is backend the source of truth?

---

# Mental Model

Authentication:

```txt
Who are you?
```

Authorization:

```txt
What are you allowed to do?
```

Frontend:

```txt
Improve UX
```

Backend:

```txt
Enforce Security
```
