import { CommandHandler, EventHandler, QueryHandler } from './Handlers';
import { Command, Event, Message, Query } from './Message';

export type Middleware<T extends Message<any, any>> = (
  message: T,
  next: () => void | Promise<void>,
) => void | Promise<void>;

export interface MessageBus {
  use(middleware: Middleware<Message<any, any>>): void;
  registerCommandHandler(commandType: string, handler: CommandHandler): void;
  sendCommand(command: Command<any, any>): Promise<void>;
  registerQueryHandler(queryType: string, handler: QueryHandler): void;
  sendQuery(query: Query<any, any>): Promise<any>;
  registerEventHandler(eventType: string, handler: EventHandler): void;
  publishEvent(event: Event<any, any>): Promise<void>;
}

export class BasicMessageBus implements MessageBus {
  constructor(
    private commandHandlers: Map<string, CommandHandler> = new Map(),
    private queryHandlers: Map<string, QueryHandler> = new Map(),
    private eventHandlers: Map<string, EventHandler[]> = new Map(),
    private middlewares: Middleware<Message<any, any>>[] = [],
  ) {}

  use(middleware: Middleware<Message<any, any>>): void {
    this.middlewares.push(middleware);
  }

  registerCommandHandler(commandType: string, handler: CommandHandler): void {
    this.commandHandlers.set(commandType, handler);
  }

  async sendCommand(command: Command<any, any>): Promise<void> {
    const handler = this.commandHandlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command type ${command.type}`);
    }
    await this.applyMiddlewares(command, async () => {
      await handler.handle(command);
    });
  }

  registerQueryHandler(queryType: string, handler: QueryHandler): void {
    this.queryHandlers.set(queryType, handler);
  }

  async sendQuery(query: Query<any, any>): Promise<any> {
    const handler = this.queryHandlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler registered for query type ${query.type}`);
    }
    let result: any;
    await this.applyMiddlewares(query, async () => {
      result = await handler.handle(query);
    });
    if (result === undefined) {
      throw new Error('Handler did not return a result');
    }
    return result;
  }

  registerEventHandler(eventType: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventType, handlers);
  }

  async publishEvent(event: Event<any, any>): Promise<void> {
    const handlers = this.eventHandlers.get(event.type) || [];
    for (const handler of handlers) {
      await this.applyMiddlewares(event, async () => {
        await handler.handle(event);
      });
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
