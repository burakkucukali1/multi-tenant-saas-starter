import { createLogger } from "@/lib/logger/create-logger";
import { redactLogFields } from "@/lib/logger/redact";
import type { LogEntry, LogSink } from "@/lib/logger/types";

class MemorySink implements LogSink {
  readonly entries: LogEntry[] = [];

  write(entry: LogEntry): void {
    this.entries.push(entry);
  }
}

describe("lib/logger", () => {
  it("redacts sensitive field keys", () => {
    expect(
      redactLogFields({ userId: "u1", accessToken: "secret-value" }),
    ).toEqual({ userId: "u1", accessToken: "[Redacted]" });
  });

  it("filters below configured level", () => {
    const sink = new MemorySink();
    const logger = createLogger({
      sink,
      level: "warn",
      environment: "test",
    });

    logger.debug("hidden");
    logger.info("hidden");
    logger.warn("visible");
    logger.error("visible");

    expect(sink.entries).toHaveLength(2);
    expect(sink.entries.map((e) => e.level)).toEqual(["warn", "error"]);
  });

  it("writes structured entries with child context", () => {
    const sink = new MemorySink();
    const logger = createLogger({
      sink,
      level: "info",
      environment: "test",
      context: "parent",
    });

    logger.child("child").info("hello", { ok: true });

    expect(sink.entries[0]).toMatchObject({
      level: "info",
      message: "hello",
      environment: "test",
      context: "parent.child",
      fields: { ok: true },
    });
    expect(sink.entries[0]?.timestamp).toBeDefined();
  });
});
