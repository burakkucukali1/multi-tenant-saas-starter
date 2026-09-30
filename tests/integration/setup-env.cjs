/**
 * Loads repo env files for integration tests only.
 * Jest does not load .env.local automatically (unlike `next dev`).
 * CI injects secrets via process.env — never override existing vars (dotenv default).
 */
const { existsSync } = require("node:fs");
const path = require("node:path");

const { config: loadEnv } = require("dotenv");

const repoRoot = path.resolve(__dirname, "../..");

/** @param {string} filename @param {{ override?: boolean }} [options] */
function loadEnvFile(filename, { override = false } = {}) {
  const fullPath = path.join(repoRoot, filename);
  if (!existsSync(fullPath)) {
    return;
  }
  loadEnv({ path: fullPath, override, quiet: true });
}

loadEnvFile(".env");
loadEnvFile(".env.local", { override: true });

if (process.env.NODE_ENV === "test") {
  loadEnvFile(".env.test");
  loadEnvFile(".env.test.local", { override: true });
}
