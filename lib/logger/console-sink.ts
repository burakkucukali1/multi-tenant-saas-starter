import type { LogEntry, LogSink } from "./types";

/** Default sink: one JSON object per line for host platform logs (ADR-0029). */
export class ConsoleJsonSink implements LogSink {
  write(entry: LogEntry): void {
    const line = JSON.stringify(entry);
    if (entry.level === "error" || entry.level === "warn") {
      console.error(line);
    } else {
      console.log(line);
    }
  }
}
