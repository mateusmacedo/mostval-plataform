import { LogFormatter, LogLevel, LogTransport } from '../../../application/Logger';

export interface Writable {
  write(chunk: unknown, encoding?: string, callback?: (error: Error | null) => void): boolean;
}

export interface AsyncWritable {
  write(chunk: unknown, encoding?: string): Promise<void>;
}

export type TWritable = Writable | AsyncWritable;

export interface DefaultTransportOptions {
  formatter: LogFormatter;
  writeable?: TWritable;
}

export class DefaultTransport implements LogTransport {
  private formatter: LogFormatter;
  private output: TWritable;

  constructor(options: DefaultTransportOptions) {
    if (!options.formatter) {
      throw new Error('A valid formatter must be provided.');
    }
    this.formatter = options.formatter;
    this.output = options.writeable || (process.stdout as TWritable);
  }

  log(level: LogLevel, message: string, meta?: unknown): void {
    try {
      const formattedMessage = this.formatter.format(level, message, meta);
      this.output.write(formattedMessage);
    } catch (error) {
      this.output.write(
        `Error formatting log message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
