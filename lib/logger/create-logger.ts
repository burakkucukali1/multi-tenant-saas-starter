import { redactLogFields } from "./redact";
import type {
  LogEntry,
  LogFields,
  LogLevel,
  Logger,
  LoggerOptions,
} from "./types";
import { LOG_LEVEL_ORDER } from "./types";

function shouldLog(configured: LogLevel, messageLevel: LogLevel): boolean {
  return LOG_LEVEL_ORDER[messageLevel] >= LOG_LEVEL_ORDER[configured];
}

function createLoggerImpl(options: LoggerOptions): Logger {
  const emit = (level: LogLevel, message: string, fields?: LogFields) => {
    if (!shouldLog(options.level, level)) {
      return;
    }
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: options.environment,
      context: options.context,
      fields: redactLogFields(fields),
    };
    options.sink.write(entry);
  };

  return {
    debug: (message, fields) => emit("debug", message, fields),
    info: (message, fields) => emit("info", message, fields),
    warn: (message, fields) => emit("warn", message, fields),
    error: (message, fields) => emit("error", message, fields),
    child: (context) =>
      createLoggerImpl({
        ...options,
        context: options.context ? `${options.context}.${context}` : context,
      }),
  };
}

export function createLogger(options: LoggerOptions): Logger {
  return createLoggerImpl(options);
}
