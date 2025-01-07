import { LogFormatter, LogLevel, LogTransport } from '../../../application/Logger'

export interface Writable {
  write(
    chunk: unknown,
    encoding?: BufferEncoding | undefined,
    callback?: (error?: Error) => void,
  ): boolean
}

export interface AsyncWritable {
  write(chunk: unknown, encoding?: BufferEncoding): Promise<void>
}

export type TWritable = Writable | AsyncWritable

export interface DefaultTransportOptions {
  formatter: LogFormatter
  writeable?: TWritable
}

export class DefaultTransport implements LogTransport {
  private readonly output: TWritable

  constructor(private options: DefaultTransportOptions) {
    if (!options.formatter) {
      throw new Error('A valid formatter must be provided')
    }
    this.output = options.writeable ?? (process.stdout as unknown as TWritable)
  }

  async log(level: LogLevel, message: string, meta?: unknown): Promise<void> {
    try {
      const formattedMessage = this.options.formatter.format(level, message, meta)
      if ('write' in this.output && typeof this.output.write === 'function') {
        await this.output.write(formattedMessage)
      }
    } catch (error) {
      console.error(
        `Error in DefaultTransport: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
}
