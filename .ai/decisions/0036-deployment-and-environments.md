# ADR-0036: Deployment Target and Environments

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 0 (CI and secrets). Phase 8 (production)

## Context

No deployment target, environment topology, secret management, or backup mechanism has been decided.

## Questions

- Hosting target (for example Vercel, or self-hosted Node).
- Environments: local, preview, staging, production. Is each backed by its own Supabase project?
- Secret management: where the Clerk, Stripe, and Supabase service role keys live, and how they are rotated.
- Backups and point-in-time recovery (Supabase plan tier).
- Region and data residency.

## Partially Resolved

The Supabase environment topology, migrations, config-as-code, and backup approach are covered by ADR-0041. Still open here:

- hosting target
- Supabase tier for staging and production
- recovery point and recovery time targets (PITR)
- region and data residency
- secret management tooling

Supabase secrets and PAT governance for cloud projects: ADR-0041 §10.

## Recommendation

Separate Supabase projects for staging and production at minimum. The service role key is available only to server runtime environments.

## Decision

Pending owner decision.
