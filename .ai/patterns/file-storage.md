# File Storage Pattern

## Primary Goal

Store and serve files securely and efficiently.

Maintain:

- Security
- Scalability
- Reliability
- Cost Efficiency

Files are infrastructure assets.

Not database records.

---

# Mental Model

User

↓

Upload

↓

Storage Provider

↓

Metadata

↓

Application

Store files separately.

Store metadata in the database.

---

# Core Principle

Do not store files in the database.

Store:

- URLs
- Keys
- Metadata

in the database.

Store actual files in object storage.

---

# Recommended Model

```ts
{
  (id, tenantId, storageKey, fileName, mimeType, size, createdAt);
}
```

---

# Ownership

Files should be tenant-owned.

Example:

```ts
{
  tenantId;
}
```

Ownership must be explicit.

---

# Storage Providers

Examples:

- S3
- Cloudflare R2
- GCS
- UploadThing

Provider choice is implementation detail.

---

# Upload Flow

Recommended:

```txt
Client

↓

Upload URL

↓

Storage

↓

Metadata Saved
```

Avoid proxying large files through the application.

---

# Authorization

Always validate:

- Tenant ownership
- Permissions
- Access rights

Before exposing files.

---

# Private Files

Private files should use:

- Signed URLs
- Temporary access tokens

Avoid public URLs for sensitive data.

---

# Public Files

Use public URLs only when intentional.

Examples:

- Avatars
- Marketing assets

---

# File Validation

Validate:

- File type
- File size
- Allowed extensions

Never trust client metadata.

---

# Virus Scanning

Consider scanning for:

- User uploads
- Public uploads
- Shared files

Especially in enterprise products.

---

# Deletion

Options:

Soft Delete

↓

Retention

↓

Permanent Deletion

Based on business requirements.

---

# Lifecycle

Consider:

- Expiration
- Archiving
- Cleanup

Unused files create cost.

---

# Observability

Track:

- Upload failures
- Download failures
- Storage growth
- Usage by tenant

---

# Testing Requirements

Verify:

- Upload permissions
- Download permissions
- Tenant isolation
- Signed URL expiration

---

# Common Mistakes

Avoid:

- Database file storage
- Public sensitive files
- Missing ownership checks
- Missing validation

---

# Review Checklist

Ask:

- Is ownership explicit?
- Is access controlled?
- Are uploads validated?
- Is storage provider abstracted?
- Are private files protected?

---

# Mental Model

Store files in object storage.

Store metadata in the database.
