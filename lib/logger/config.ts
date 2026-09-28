import type { LogLevel } from "./types";

const LOG_LEVELS: LogLevel[] = ["debug", "info", "warn", "error"];

function parseLogLevel(raw: string | undefined, fallback: LogLevel): LogLevel {
  if (!raw) {
    return fallback;
  }
  const normalized = raw.trim().toLowerCase();
  return LOG_LEVELS.includes(normalized as LogLevel)
    ? (normalized as LogLevel)
    : fallback;
}

export interface LoggerConfig {
  level: LogLevel;
  environment: string;
}

/** Environment-aware defaults (ADR-0029). Override with LOG_LEVEL. */
export function getLoggerConfig(): LoggerConfig {
  const environment = process.env.NODE_ENV ?? "development";
  const defaultLevel: LogLevel =
    environment === "production" ? "info" : "debug";
  return {
    level: parseLogLevel(process.env.LOG_LEVEL, defaultLevel),
    environment,
  };
}
