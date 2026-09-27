# Clerk Integration Pattern

## Primary Goal

Use Clerk for authentication.

Not authorization.

---

# Core Principle

Clerk answers:

Who is the user?

Your application answers:

What can the user do?

---

# Authentication

Use Clerk for:

- Sign In
- Sign Up
- Session Management
- Identity

---

# Authorization

Authorization belongs to:

- Application Services
- Domain Rules
- Permission System

Never rely solely on Clerk roles.

---

# User Sync

Persist local user records.

Example:

```ts
{
  (clerkId, email);
}
```

Avoid making Clerk your only user datastore.

---

# Webhooks

Use Clerk webhooks for:

- User Created
- User Updated
- User Deleted

Keep local data synchronized.

---

# Multi-Tenant

Clerk identities are global.

Permissions remain tenant-specific.

---

# Common Mistakes

Avoid:

- Global role checks
- Missing local users
- Using Clerk as authorization system

---

# Mental Model

Clerk manages identity.

The application manages access.
