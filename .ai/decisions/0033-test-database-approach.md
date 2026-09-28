# ADR-0033: Test Database Approach

- Status: Superseded by ADR-0041
- Date: 2026-09-27
- Superseded: 2026-09-28. The owner requires a cloud-first workflow on Supabase Cloud Free tier, with no Docker-based primary workflow. Tests run against a dedicated CI cloud project (ADR-0041 §1, §9).
- Approval level: L2
- Needed by: Phase 0 (CI) and Phase 2 (integration tests)

## Context

Integration and isolation tests run against real Postgres (ADR-0025).

## Options

1. **Local Supabase via Docker (Supabase CLI)**, locally and in CI.
   - Free, deterministic, and runs offline.
   - CI needs Docker, and cold starts are slow.
2. **Supabase branch databases in CI.**
   - Closer to production.
   - Costs money, depends on the network, and cleanup is slower.

## Recommendation

Option 1 for local development and CI. Option 2 optionally for pre-release verification.

## Decision

Pending owner approval.
