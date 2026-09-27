# CRM Domain Rules

## Domain Overview

CRM systems manage:

- Leads
- Contacts
- Companies
- Activities
- Pipelines

---

# Ownership

Every record must have an owner.

Examples:

Lead
→ User

Opportunity
→ Team

Account
→ Tenant

---

# Auditability

Track:

- Status changes
- Ownership changes
- Pipeline movement

Audit logs are important.

---

# Permissions

CRM systems require strong permissions.

Examples:

- View lead
- Edit lead
- Delete lead
- Export contacts

Avoid broad admin-only logic.

Use permissions.

---

# Search

CRM data grows quickly.

Plan for:

- Filtering
- Sorting
- Full-text search

---

# Reporting

Reporting is a core feature.

Design data models with reporting in mind.

---

# Soft Delete

Prefer soft delete.

Sales data often requires recovery.

---

# Review Checklist

- Is ownership explicit?
- Are permissions granular?
- Are changes auditable?
- Is reporting supported?
- Is soft delete considered?
