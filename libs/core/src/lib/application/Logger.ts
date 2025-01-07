import { IHandler } from '../domain/model/Handlers'
import { Message } from '../domain/model/Message'

export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface Logger {
  log(level: LogLevel, message: string, meta?: unknown): void
  info(message: string, meta?: unknown): void
  error(message: string, meta?: unknown): void
  warn(message: string, meta?: unknown): void
  debug(message: string, meta?: unknown): void
  trace(message: string, meta?: unknown): void
  fatal(message: string, meta?: unknown): void
}

export interface LogTransport {
  log(level: LogLevel, message: string, meta?: unknown): void
}

export interface LogFormatter {
  format(level: LogLevel, message: string, meta?: unknown): string
}

export interface LoggerWithTransport extends Logger {
  addTransport(transport: LogTransport): void
  removeTransport(transport: LogTransport): void
  setLogLevel(level: LogLevel): void
  setDefaultMeta(meta: ILogContext): void
}

export interface ILogContext {
  requestId?: string
  userId?: string
  transactionId?: string
  [key: string]: unknown
}

export function LogHandler(logger?: Logger) {
  return function <T extends Message<any>, R, E extends Error>(
    target: IHandler<T, R, E>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    const log = logger ?? console

    descriptor.value = async function (...args: any[]) {
      const message = args[0]
      log.info(`Handling ${message.type}`, { timestamp: new Date().toISOString() })

      try {
        const result = await originalMethod.apply(this, args)
        log.info(`Handled ${message.type} successfully`)
        return result
      } catch (error) {
        log.error(`Error handling ${message.type}`, { error })
        throw error
      }
    }
    return descriptor
  }
}
