import { AggregateRoot } from './AggregateRoot';
import { MessageBus } from './Bus';
import { Event } from './Message';

type ID = string;
class DomainEvent extends Event<any, any> {
  constructor() {
    super({ id: 'id', type: 'type', payload: {}, metadata: {}, timestamp: 0 });
  }
}
class AggregateRootSpec extends AggregateRoot<ID> {
  constructor(id: ID, version = 0) {
    super(id, version);
  }

  public domainFeature(): void {
    this.addDomainEvent(new DomainEvent());
  }
}
describe('AggregateRootSpec', () => {
  let aggregateRootSpec: AggregateRootSpec;
  let messageBus: MessageBus;

  beforeEach(async () => {
    aggregateRootSpec = new AggregateRootSpec('id');
    messageBus = jest.createMockFromModule<MessageBus>('./Bus');
    messageBus.publishEvent = jest.fn();
  });

  it('should be defined', () => {
    aggregateRootSpec.domainFeature();
    expect(aggregateRootSpec).toBeDefined();
  });

  it('should publish domain events', async () => {
    aggregateRootSpec.domainFeature();
    await aggregateRootSpec.publishDomainEvents(messageBus);
    expect(messageBus.publishEvent).toHaveBeenCalled();
  });
});
