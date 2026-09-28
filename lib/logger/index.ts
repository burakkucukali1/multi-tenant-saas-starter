import "server-only";

import { getLoggerConfig } from "./config";
import { ConsoleJsonSink } from "./console-sink";
import { createLogger } from "./create-logger";
import type { Logger, LoggerOptions } from "./types";

export type {
  LogEntry,
  LogFields,
  LogLevel,
  LogSink,
  Logger,
  LoggerOptions,
} from "./types";
export { LOG_LEVEL_ORDER } from "./types";
export { getLoggerConfig } from "./config";
export { ConsoleJsonSink } from "./console-sink";
export { createLogger } from "./create-logger";
export { redactLogFields } from "./redact";

let defaultServerLogger: Logger | undefined;

/** Process-wide server logger. Swap implementation by changing sink wiring here (ADR-0029). */
export function getServerLogger(): Logger {
  if (!defaultServerLogger) {
    const { level, environment } = getLoggerConfig();
    defaultServerLogger = createLogger({
      sink: new ConsoleJsonSink(),
      level,
      environment,
    });
  }
  return defaultServerLogger;
}

/** Explicit factory when a custom sink is injected (future vendor adapter). */
export function createServerLogger(
  overrides: Partial<
    Pick<LoggerOptions, "sink" | "level" | "environment" | "context">
  >,
): Logger {
  const config = getLoggerConfig();
  return createLogger({
    sink: overrides.sink ?? new ConsoleJsonSink(),
    level: overrides.level ?? config.level,
    environment: overrides.environment ?? config.environment,
    context: overrides.context,
  });
}
