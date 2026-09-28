/**
 * Source of truth for ADR-0021. Update here, then run: pnpm depcruise:generate
 * Changelog must match .ai/decisions/0021-ranked-module-dependency-map.md
 */

/** @typedef {{ rank: number, path: string, mayDependOn: string[] }} ModuleDef */

/** @type {Record<string, ModuleDef>} */
export const modules = {
  "lib/config": { rank: 0, path: "^lib/config/", mayDependOn: [] },
  "lib/i18n": { rank: 0, path: "^lib/i18n/", mayDependOn: [] },
  "lib/db": {
    rank: 1,
    path: "^lib/db/(?!platform/).+",
    mayDependOn: ["lib/config"],
  },
  "lib/db/platform": { rank: 1, path: "^lib/db/platform/", mayDependOn: ["lib/config"] },
  "lib/auth": { rank: 1, path: "^lib/auth/", mayDependOn: ["lib/config"] },
  "lib/stripe": { rank: 1, path: "^lib/stripe/", mayDependOn: ["lib/config"] },
  "shared": { rank: 5, path: "^shared/", mayDependOn: ["lib/config", "lib/i18n"] },
  "features/audit": { rank: 10, path: "^features/audit/", mayDependOn: ["lib/db"] },
  "features/authz": { rank: 10, path: "^features/authz/", mayDependOn: ["lib/db"] },
  "platform/access": {
    rank: 15,
    path: "^platform/access/",
    mayDependOn: ["lib/db/platform", "lib/auth", "features/audit"],
  },
  "features/identity": {
    rank: 20,
    path: "^features/identity/",
    mayDependOn: ["lib/db", "lib/auth", "features/audit"],
  },
  "features/workspaces": {
    rank: 30,
    path: "^features/workspaces/",
    mayDependOn: ["lib/db", "features/audit", "features/identity"],
  },
  "features/plans": { rank: 30, path: "^features/plans/", mayDependOn: ["lib/db"] },
  "features/legal": {
    rank: 30,
    path: "^features/legal/",
    mayDependOn: ["lib/db", "features/audit"],
  },
  "features/memberships": {
    rank: 40,
    path: "^features/memberships/",
    mayDependOn: [
      "lib/db",
      "features/audit",
      "features/authz",
      "features/identity",
      "features/workspaces",
    ],
  },
  "features/subscriptions": {
    rank: 50,
    path: "^features/subscriptions/",
    mayDependOn: ["lib/db", "lib/stripe", "features/audit", "features/plans", "features/workspaces"],
  },
  "features/promotions": {
    rank: 50,
    path: "^features/promotions/",
    mayDependOn: ["lib/db", "lib/stripe", "features/audit", "features/plans"],
  },
  "features/entitlements": {
    rank: 60,
    path: "^features/entitlements/",
    mayDependOn: [
      "lib/db",
      "features/audit",
      "features/plans",
      "features/subscriptions",
      "features/memberships",
    ],
  },
  "features/deals": {
    rank: 70,
    path: "^features/deals/",
    mayDependOn: [
      "lib/db/platform",
      "lib/stripe",
      "features/audit",
      "features/entitlements",
      "features/subscriptions",
      "features/plans",
    ],
  },
  "features/referrals": {
    rank: 70,
    path: "^features/referrals/",
    mayDependOn: [
      "lib/db",
      "lib/stripe",
      "features/audit",
      "features/identity",
      "features/entitlements",
      "features/subscriptions",
    ],
  },
  "features/tenant-context": {
    rank: 75,
    path: "^features/tenant-context/",
    mayDependOn: [
      "lib/db",
      "lib/auth",
      "features/identity",
      "features/workspaces",
      "features/memberships",
      "features/authz",
      "features/entitlements",
      "features/legal",
    ],
  },
  "workflows": {
    rank: 80,
    path: "^workflows/([^/]+)/",
    mayDependOn: ["*below80"],
  },
  "platform": {
    rank: 85,
    path: "^platform/(?!access/).+",
    mayDependOn: [
      "lib/db/platform",
      "platform/access",
      "features/audit",
      "shared",
      "features",
      "workflows",
    ],
  },
  "app": { rank: 100, path: "^app/", mayDependOn: ["shared", "features", "workflows", "platform"] },
  "middleware": { rank: 100, path: "^middleware\\.ts$", mayDependOn: [] },
};

export const forbiddenPairs = [
  {
    name: "authz-platform-access-mutual",
    from: "^features/authz/",
    to: "^platform/access/",
  },
  {
    name: "platform-access-authz-mutual",
    from: "^platform/access/",
    to: "^features/authz/",
  },
  {
    name: "lib-db-platform-restricted",
    from: "^(?!platform/|features/deals/).+",
    to: "^lib/db/platform/",
  },
  {
    name: "workspace-scope-mint-restricted",
    from: "^(?!features/tenant-context/|platform/access/).+",
    to: "^lib/db/workspace-scope",
  },
];

export const sdkPackages = [
  "@supabase/supabase-js",
  "@supabase/ssr",
  "@clerk/nextjs",
  "@clerk/backend",
  "stripe",
];
