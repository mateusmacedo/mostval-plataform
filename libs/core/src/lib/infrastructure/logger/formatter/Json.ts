import { LogFormatter, LogLevel } from '../../../application/Logger'

export interface JsonLogEntry {
  level: LogLevel
  message: string
  meta: Record<string, unknown>
  timestamp: string
  pid: number
}

export class JsonFormatter implements LogFormatter {
  private static readonly circularReplacer = () => {
    const seen = new WeakSet()
    return (key: string, value: unknown) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]'
        }
        seen.add(value)
      }
      return value
    }
  }

  constructor(private readonly options: { pretty?: boolean } = {}) {}

  format(level: LogLevel, message: string, meta?: unknown): string {
    const logEntry: JsonLogEntry = {
      level,
      message: message || 'undefined',
      meta: this.normalizeMeta(meta),
      timestamp: new Date().toISOString(),
      pid: process.pid,
    }

    return this.options.pretty
      ? JSON.stringify(logEntry, JsonFormatter.circularReplacer(), 2)
      : JSON.stringify(logEntry, JsonFormatter.circularReplacer())
  }

  private normalizeMeta(meta: unknown): Record<string, unknown> {
    if (!meta) return {}
    if (typeof meta !== 'object') return { value: meta }
    return meta as Record<string, unknown>
  }
}
