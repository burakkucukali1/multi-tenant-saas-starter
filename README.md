# multi-tenant-saas-starter

Reusable multi-tenant SaaS foundation. Architecture and progress: `.ai/` and `AGENTS.md`.

Contributing: pull requests use [`.github/pull_request_template.md`](.github/pull_request_template.md). Branch protection: [`.github/branch-protection.md`](.github/branch-protection.md). Dependencies: [Renovate](.github/renovate.md) (`renovate.json`, ADR-0030).

## Requirements

- Node.js **24.21.0** (see `.nvmrc`)
- pnpm **12.6.0** (`corepack enable`)

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm format:check
pnpm typecheck   # runs next typegen, then tsc (needs generated route types)
pnpm depcruise
pnpm depcruise:validate-rules
pnpm test
pnpm test:unit
pnpm test:integration
pnpm ci:check
pnpm test:e2e
```

CI details: [`.github/README.md`](.github/README.md).
