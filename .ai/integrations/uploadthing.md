# UploadThing Integration Pattern

## Primary Goal

Provide secure file uploads.

---

# Core Principle

UploadThing manages uploads.

Application manages permissions.

---

# Upload Flow

Client

↓

UploadThing

↓

Storage

↓

Metadata

↓

Application

---

# Authorization

Always validate:

- User
- Tenant
- Permissions

before issuing upload permissions.

---

# File Validation

Validate:

- Type
- Size
- Limits

Server-side.

---

# Ownership

Persist:

```ts
{
  (tenantId, uploadedBy, fileKey);
}
```

Ownership must be explicit.

---

# Cleanup

Remove orphaned uploads.

Unused files create cost.

---

# Common Mistakes

Avoid:

- Public sensitive files
- Missing ownership
- Missing validation

---

# Mental Model

UploadThing moves bytes.

The application owns access.
