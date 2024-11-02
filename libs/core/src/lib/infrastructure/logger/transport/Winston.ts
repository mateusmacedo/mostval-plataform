import winston from 'winston';
import { LogLevel, LogTransport } from '../../../application/Logger';

export interface WinstonTransportOptions {
  level?: LogLevel;
  format?: winston.Logform.Format;
  transports?: winston.transport[];
}

export class WinstonTransport implements LogTransport {
  private winstonLogger: winston.Logger;

  constructor(options: WinstonTransportOptions = {}) {
    const {
      level = LogLevel.INFO,
      format = winston.format.json(),
      transports = [new winston.transports.Console()],
    } = options;

    const loggerLevel = this.mapLogLevel(level);

    this.winstonLogger = winston.createLogger({
      level: loggerLevel,
      format,
      transports,
    });
  }

  private mapLogLevel(level: LogLevel): string {
    const levelMapping: Record<LogLevel, string> = {
      [LogLevel.FATAL]: 'fatal',
      [LogLevel.ERROR]: 'error',
      [LogLevel.WARN]: 'warn',
      [LogLevel.INFO]: 'info',
      [LogLevel.DEBUG]: 'debug',
      [LogLevel.TRACE]: 'silly',
    };
    return levelMapping[level] || 'info';
  }

  log(level: LogLevel, message: string, meta?: unknown): void {
    const logLevel = this.mapLogLevel(level);
    this.winstonLogger.log(logLevel, message, meta);
  }
}
