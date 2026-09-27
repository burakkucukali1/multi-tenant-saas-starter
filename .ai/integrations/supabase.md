# Supabase Integration Pattern

## Primary Goal

Use Supabase as application infrastructure.

Maintain:

- Security
- Reliability
- Simplicity

Supabase provides infrastructure.

Business rules remain in the application.

---

# Core Principle

Supabase is not the domain layer.

Use Supabase for:

- Database
- Auth
- Storage
- Realtime

---

# Database Access

Preferred:

Feature

↓

Service

↓

Repository

↓

Supabase

Avoid direct component access.

---

# Row Level Security

Use RLS as defense in depth.

Not as the only authorization layer.

Always enforce permissions in application code.

---

# Authentication

Supabase Auth handles:

- Identity
- Sessions
- Login

Authorization remains application responsibility.

---

# Storage

Use Supabase Storage for:

- Files
- Uploads
- Documents

Store metadata in the database.

---

# Realtime

Only enable when requirements justify it.

Avoid default realtime usage.

---

# Environment Separation

Maintain separate:

- Development
- Staging
- Production

Never share environments.

---

# Secrets

Never expose:

- Service Role Keys
- Admin Credentials

Only public keys belong in the client.

---

# Common Mistakes

Avoid:

- Business logic in RLS
- Client-side service keys
- Direct SDK usage everywhere

---

# Mental Model

Supabase provides infrastructure.

The application owns behavior.
