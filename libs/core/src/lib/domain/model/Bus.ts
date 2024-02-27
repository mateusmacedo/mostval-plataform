import { CommandHandler, EventHandler, QueryHandler } from './Handlers';
import { Command, Event, Message, Query } from './Message';

export type Middleware<T extends Message<any, any>> = (
  message: T,
  next: () => void | Promise<void>,
) => void | Promise<void>;

export interface MessageBus {
  use(middleware: Middleware<Message<any, any>>): void;
  registerCommandHandler<T extends Command<any, any>>(
    commandType: string,
    handler: CommandHandler<T>,
  ): void;
  sendCommand<T extends Command<any, any>>(command: T): Promise<void>;
  registerQueryHandler<T extends Query<any, any>, R>(
    queryType: string,
    handler: QueryHandler<T, R>,
  ): void;
  sendQuery<T extends Query<any, any>, R>(query: T): Promise<R>;
  registerEventHandler<T extends Event<any, any>>(
    eventType: string,
    handler: EventHandler<T>,
  ): void;
  publishEvent<T extends Event<any, any>>(event: T): Promise<void>;
}

export class BasicMessageBus implements MessageBus {
  constructor(
    private commandHandlers: Map<string, CommandHandler<Command<any, any>>> = new Map(),
    private queryHandlers: Map<string, QueryHandler<Query<any, any>, any>> = new Map(),
    private eventHandlers: Map<string, EventHandler<Event<any, any>>[]> = new Map(),
    private middlewares: Middleware<Message<any, any>>[] = [],
  ) {}

  use(middleware: Middleware<Message<any, any>>): void {
    this.middlewares.push(middleware);
  }

  registerCommandHandler<T extends Command<any, any>>(
    commandType: string,
    handler: CommandHandler<T>,
  ): void {
    this.commandHandlers.set(commandType, handler);
  }

  async sendCommand<T extends Command<any, any>>(command: T): Promise<void> {
    const handler = this.commandHandlers.get(command.type) as CommandHandler<T>;
    if (!handler) {
      throw new Error(`No handler registered for command type ${command.type}`);
    }
    await this.applyMiddlewares(command, async () => await handler.handle(command));
  }

  registerQueryHandler<T extends Query<any, any>, R>(
    queryType: string,
    handler: QueryHandler<T, R>,
  ): void {
    this.queryHandlers.set(queryType, handler);
  }

  async sendQuery<T extends Query<any, any>, R>(query: T): Promise<R> {
    const handler = this.queryHandlers.get(query.type) as QueryHandler<T, R>;
    if (!handler) {
      throw new Error(`No handler registered for query type ${query.type}`);
    }
    let result: R | undefined;
    await this.applyMiddlewares(query, async () => {
      result = await handler.handle(query);
    });
    if (result === undefined) {
      throw new Error('Handler did not return a result');
    }
    return result;
  }

  registerEventHandler<T extends Event<any, any>>(
    eventType: string,
    handler: EventHandler<T>,
  ): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventType, handlers);
  }

  async publishEvent<T extends Event<any, any>>(event: T): Promise<void> {
    const handlers = this.eventHandlers.get(event.type) || [];
    for (const handler of handlers) {
      await this.applyMiddlewares(event, () => handler.handle(event));
    }
  }

  private async applyMiddlewares<T extends Message<any, any>>(
    message: T,
    finalHandler: () => void | Promise<void>,
  ): Promise<void> {
    const executeMiddleware = (index: number): void | Promise<void> => {
      if (index === this.middlewares.length) {
        return finalHandler();
      }
      const middleware = this.middlewares[index];
      return middleware(message, () => executeMiddleware(index + 1));
    };

    await executeMiddleware(0);
  }
}
