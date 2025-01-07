import pino from 'pino'

import { LogLevel, LogTransport } from '../../../application/Logger'

export interface PinoTransportOptions {
  level?: LogLevel
  transport?: pino.TransportSingleOptions
  destination?: pino.DestinationStream | undefined
}

export class PinoTransport implements LogTransport {
  private pinoLogger: pino.Logger

  private static readonly LOG_LEVEL_MAP: Record<LogLevel, pino.LevelWithSilent> = {
    [LogLevel.FATAL]: 'fatal',
    [LogLevel.ERROR]: 'error',
    [LogLevel.WARN]: 'warn',
    [LogLevel.INFO]: 'info',
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.TRACE]: 'trace',
  } as const

  constructor(options: PinoTransportOptions = {}) {
    const { level = LogLevel.INFO, transport, destination } = options
    const logLevel = this.mapLogLevel(level)
    this.pinoLogger = pino(
      {
        level: logLevel,
        transport,
      },
      destination,
    )
  }

  private mapLogLevel(level: LogLevel): pino.LevelWithSilent {
    return PinoTransport.LOG_LEVEL_MAP[level] || 'info'
  }

  log(level: LogLevel, message: string, meta?: unknown): void {
    const logLevel = this.mapLogLevel(level)
    this.pinoLogger[logLevel](meta, message)
  }
}
