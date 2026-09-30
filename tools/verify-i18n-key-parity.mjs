/**
 * ADR-0024 / P1-T02: `en` and `tr` message files must expose the same key paths
 * per feature file under `messages/{locale}/*.json`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const messagesRoot = path.join(repoRoot, "messages");

/** @param {unknown} value @param {string} [prefix] @returns {string[]} */
export function flattenMessageKeys(value, prefix = "") {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    if (prefix === "") {
      throw new Error("Message file root must be a JSON object");
    }
    return [prefix];
  }

  /** @type {string[]} */
  const keys = [];
  for (const [key, nested] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (
      nested !== null &&
      typeof nested === "object" &&
      !Array.isArray(nested)
    ) {
      keys.push(...flattenMessageKeys(nested, next));
    } else {
      keys.push(next);
    }
  }
  return keys.sort();
}

/**
 * @param {string} locale
 * @param {string} featureFile e.g. `public.json`
 */
function readFeatureMessages(locale, featureFile) {
  const filePath = path.join(messagesRoot, locale, featureFile);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

/**
 * @param {string} baseLocale
 * @param {string} otherLocale
 * @returns {{ ok: true } | { ok: false, errors: string[] }}
 */
export function verifyLocaleParity(baseLocale, otherLocale) {
  const baseDir = path.join(messagesRoot, baseLocale);
  const otherDir = path.join(messagesRoot, otherLocale);

  if (!fs.existsSync(baseDir) || !fs.existsSync(otherDir)) {
    return {
      ok: false,
      errors: [
        `Missing messages directory for ${baseLocale} or ${otherLocale}`,
      ],
    };
  }

  const baseFiles = fs
    .readdirSync(baseDir)
    .filter((name) => name.endsWith(".json"))
    .sort();
  const otherFiles = fs
    .readdirSync(otherDir)
    .filter((name) => name.endsWith(".json"))
    .sort();

  /** @type {string[]} */
  const errors = [];

  if (baseFiles.join(",") !== otherFiles.join(",")) {
    errors.push(
      `Feature file mismatch: ${baseLocale} [${baseFiles.join(", ")}] vs ${otherLocale} [${otherFiles.join(", ")}]`,
    );
  }

  for (const featureFile of baseFiles) {
    if (!otherFiles.includes(featureFile)) {
      continue;
    }

    const baseKeys = flattenMessageKeys(
      readFeatureMessages(baseLocale, featureFile),
    );
    const otherKeys = flattenMessageKeys(
      readFeatureMessages(otherLocale, featureFile),
    );

    const baseSet = new Set(baseKeys);
    const otherSet = new Set(otherKeys);

    for (const key of baseKeys) {
      if (!otherSet.has(key)) {
        errors.push(
          `${otherLocale}/${featureFile} missing key "${key}" (present in ${baseLocale})`,
        );
      }
    }
    for (const key of otherKeys) {
      if (!baseSet.has(key)) {
        errors.push(
          `${baseLocale}/${featureFile} missing key "${key}" (present in ${otherLocale})`,
        );
      }
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

function main() {
  const result = verifyLocaleParity("en", "tr");
  if (result.ok) {
    console.log("i18n key parity ok (en ↔ tr)");
    return;
  }

  console.error("i18n key parity failed:");
  for (const line of result.errors) {
    console.error(`  - ${line}`);
  }
  process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
