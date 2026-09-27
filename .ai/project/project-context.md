# Project Context

## Project Overview

Name:

<Project Name>

Description:

<Short description of the product>

Primary Goal:

<Business objective>

Target Users:

<Who uses this system?>

---

# Domain

Primary Domain:

- AI SaaS
- CRM
- Marketplace
- Fintech
- Internal Tool
- E-Commerce
- Custom

Secondary Domains:

<List additional domains if applicable>

Examples:

AI SaaS + CRM

Marketplace + AI SaaS

Fintech + Internal Tool

---

# Product Stage

Current Stage:

- Idea
- MVP
- Early Production
- Growth
- Scale

Guideline:

MVP:
Favor speed and simplicity.

Scale:
Favor maintainability and operational stability.

---

# Architecture

Architecture Style:

- Monolith
- Modular Monolith
- Microservices

Current Choice:

<value>

Reason:

<why>

---

# Technology Stack

Frontend:

Backend:

Database:

ORM:

Authentication:

Payments:

Email Provider:

Queue System:

File Storage:

Analytics:

Monitoring:

Deployment:

---

# Multi-Tenant Strategy

Tenant Model:

- Single Tenant
- Multi Tenant

Tenant Identifier:

- Workspace
- Organization
- Company
- Team

Tenant Resolution:

- Subdomain
- Route
- Session
- Header

Example:

acme.app.com

↓

tenant = acme

---

# Permission Model

Authorization Strategy:

- RBAC
- ABAC
- Custom

Roles:

- Owner
- Admin
- Member
- Viewer

Permission Source:

Backend

Frontend Responsibility:

UX only

---

# Billing

Billing Provider:

Stripe

Billing Owner:

Tenant

Subscription Model:

- Free
- Pro
- Enterprise

Usage Limits:

- Seats
- Storage
- API Usage
- Messages

---

# AI Features

AI Enabled:

Yes / No

AI Provider:

OpenAI
Anthropic
Custom

AI Use Cases:

- Chat
- Search
- Copilot
- Agents
- Classification

Usage Metering:

Describe billing model.

---

# Data Ownership

Every entity must define ownership.

Examples:

Workspace
→ Tenant

Project
→ Tenant

User
→ User

Conversation
→ Tenant

Document
→ Tenant

---

# Security Requirements

Compliance:

- None
- GDPR
- SOC2
- HIPAA
- PCI

Sensitive Data:

Describe.

Data Retention Policy:

Describe.

Audit Logging Required:

Yes / No

---

# Performance Requirements

Expected Active Users:

Expected Concurrent Users:

Expected Database Size:

Expected API Volume:

Realtime Requirements:

Yes / No

---

# Testing Strategy

Primary Focus:

- Integration
- E2E
- Unit

Critical Flows:

- Authentication
- Billing
- Permissions
- Data Creation
- Data Deletion

---

# Operational Requirements

Backups Required:

Yes / No

Disaster Recovery:

Yes / No

Observability:

- Sentry
- Datadog
- OpenTelemetry

---

# Project-Specific Rules

Add project-specific constraints here.

Examples:

- All billing actions require audit logs.
- AI outputs must be stored.
- Every resource must support soft delete.
- Workspace deletion requires owner approval.

---

# AI Instructions

When making architectural decisions:

1. Follow core engineering rules.
2. Follow domain rules.
3. Follow project constraints.
4. Optimize for current product stage.
5. Avoid introducing unnecessary complexity.

Always prefer solutions that reduce future maintenance cost.
