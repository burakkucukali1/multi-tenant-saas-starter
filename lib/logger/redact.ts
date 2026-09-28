import type { LogFields } from "./types";

const SENSITIVE_KEY =
  /password|secret|token|authorization|cookie|api[_-]?key|credential/i;

/** ADR-0029: never log PII, tokens, or secrets — shallow key redaction at the sink boundary. */
export function redactLogFields(
  fields: LogFields | undefined,
): LogFields | undefined {
  if (!fields) {
    return undefined;
  }

  const redacted: LogFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (SENSITIVE_KEY.test(key)) {
      redacted[key] = "[Redacted]";
      continue;
    }
    redacted[key] = value;
  }
  return redacted;
}
