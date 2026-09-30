# Architecture tooling

## Dependency map (ADR-0021)

- Source: `tools/dependency-map.mjs`
- Regenerate dependency-cruiser configs: `pnpm depcruise:generate`
- Main check: `pnpm depcruise`
- Rule self-tests: `pnpm depcruise:validate-rules`

Update the map and ADR-0021 changelog together when adding modules.

## i18n key parity (ADR-0024, P1-T02)

- Check: `pnpm i18n:verify-parity`
- Compares nested keys in each `messages/en/*.json` file with the matching `messages/tr/*.json` file.
