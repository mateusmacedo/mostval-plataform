import { AggregateRoot } from './AggregateRoot';
import { MessageBus } from './Bus';
import { BaseEntityProps } from './Entity';
import { Event } from './Message';

type AggregateProps = {
  myProp: string;
} & BaseEntityProps<string>;

class DomainEvent extends Event<unknown, unknown> {
  constructor() {
    super({ id: 'id', type: 'type', payload: {}, metadata: {}, timestamp: 0 });
  }
}
class AggregateRootSpec extends AggregateRoot<AggregateProps, string> {
  constructor(props: AggregateProps) {
    super(props);
  }

  public domainFeature(): void {
    this.addDomainEvent(new DomainEvent());
  }
}
describe('AggregateRootSpec', () => {
  let aggregateRootSpec: AggregateRootSpec;
  let messageBus: MessageBus;

  beforeEach(async () => {
    const myAggregateProps: AggregateProps = {
      id: 'test',
      version: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      myProp: 'test',
    };
    aggregateRootSpec = new AggregateRootSpec(myAggregateProps);
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
