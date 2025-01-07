import winston from 'winston'

import { LogLevel, LogTransport } from '../../../application/Logger'

export interface WinstonTransportOptions {
  level?: LogLevel
  format?: winston.Logform.Format
  transports?: winston.transport[]
}

export class WinstonTransport implements LogTransport {
  private static readonly LOG_LEVEL_MAP: Record<LogLevel, string> = {
    [LogLevel.FATAL]: 'fatal',
    [LogLevel.ERROR]: 'error',
    [LogLevel.WARN]: 'warn',
    [LogLevel.INFO]: 'info',
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.TRACE]: 'silly',
  } as const

  private winstonLogger: winston.Logger

  constructor(private options: WinstonTransportOptions = {}) {
    const {
      level = LogLevel.INFO,
      format = winston.format.json(),
      transports = [new winston.transports.Console()],
    } = options

    this.winstonLogger = winston.createLogger({
      level: this.mapLogLevel(level),
      format,
      transports,
    })
  }

  private mapLogLevel(level: LogLevel): string {
    return WinstonTransport.LOG_LEVEL_MAP[level] || 'info'
  }

  log(level: LogLevel, message: string, meta?: unknown): void {
    const logLevel = this.mapLogLevel(level)
    this.winstonLogger.log(logLevel, message, meta)
  }
}
