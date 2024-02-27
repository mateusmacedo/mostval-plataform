import { BasicMessageBus, Middleware } from './Bus';
import { Handler, QueryHandler } from './Handlers';
import { Command, Event, Query } from './Message';

describe('BasicMessageBus', () => {
  let commandHandler: Handler<any>;
  let queryHandler: QueryHandler<any, any>;
  let eventHandler: Handler<any>;
  let middleware: Middleware<any>;
  let messageBus: BasicMessageBus;

  beforeEach(() => {
    commandHandler = jest.createMockFromModule<Handler<any>>('./Handlers');
    commandHandler.handle = jest.fn();

    queryHandler = jest.createMockFromModule<QueryHandler<any, any>>('./Handlers');
    queryHandler.handle = jest.fn();

    eventHandler = jest.createMockFromModule<Handler<any>>('./Handlers');
    eventHandler.handle = jest.fn();

    middleware = jest.fn().mockImplementation((message, next) => {
      next();
    });
    messageBus = new BasicMessageBus();
  });

  describe('use', () => {
    it('should add the middleware to the middlewares array', () => {
      messageBus.use(middleware);
      expect(messageBus['middlewares']).toContain(middleware);
    });
  });

  describe('registerCommandHandler', () => {
    it('should register the command handler', () => {
      messageBus.registerCommandHandler('commandType', commandHandler);
      expect(messageBus['commandHandlers'].get('commandType')).toBe(commandHandler);
    });
  });

  describe('sendCommand', () => {
    it('should throw an error if no handler is registered for the command type', async () => {
      const command = {
        type: 'unknownCommandType',
        id: 'id',
        payload: {},
        metadata: {},
        timestamp: 0,
      } as Command;

      await expect(messageBus.sendCommand(command)).rejects.toThrow(
        `No handler registered for command type ${command.type}`,
      );
    });

    it('should call the handler and apply middlewares', async () => {
      const command = {
        type: 'commandType',
        id: 'id',
        payload: {},
        metadata: {},
        timestamp: 0,
      } as Command;
      messageBus.use(middleware);
      messageBus.registerCommandHandler('commandType', commandHandler);

      await messageBus.sendCommand(command);

      expect(commandHandler.handle).toHaveBeenCalledWith(command);
      expect(middleware).toHaveBeenCalledWith(command, expect.any(Function));
    });
  });

  describe('registerQueryHandler', () => {
    it('should register the query handler', () => {
      messageBus.registerQueryHandler('queryType', queryHandler);
      expect(messageBus['queryHandlers'].get('queryType')).toBe(queryHandler);
    });
  });

  describe('sendQuery', () => {
    it('should throw an error if no handler is registered for the query type', async () => {
      const query = { type: 'unknownQueryType' } as Query;
      await expect(messageBus.sendQuery(query)).rejects.toThrow(
        `No handler registered for query type ${query.type}`,
      );
    });

    it('should call the handler, apply middlewares, and return the result', async () => {
      const query = { type: 'queryType' } as Query;
      queryHandler.handle = jest.fn().mockResolvedValue('result');
      messageBus.use(middleware);
      messageBus.registerQueryHandler('queryType', queryHandler);

      const result = await messageBus.sendQuery(query);

      expect(queryHandler.handle).toHaveBeenCalledWith(query);
      expect(result).toBe('result');
      expect(middleware).toHaveBeenCalledWith(query, expect.any(Function));
    });

    it('should throw an error if the handler does not return a result', async () => {
      const query = { type: 'queryType' } as Query;
      messageBus.registerQueryHandler('queryType', queryHandler);

      await expect(messageBus.sendQuery(query)).rejects.toThrow('Handler did not return a result');
    });
  });

  describe('registerEventHandler', () => {
    it('should register the event handler', () => {
      messageBus.registerEventHandler('eventType', eventHandler);
      expect(messageBus['eventHandlers'].get('eventType')).toContain(eventHandler);
    });
  });

  describe('publishEvent', () => {
    it('should call the handlers and apply middlewares', async () => {
      const event = { type: 'eventType' } as Event;
      messageBus.use(middleware);
      messageBus.registerEventHandler('eventType', eventHandler);

      await messageBus.publishEvent(event);

      expect(eventHandler.handle).toHaveBeenCalledWith(event);
      expect(middleware).toHaveBeenCalledWith(event, expect.any(Function));
    });
  });
});
