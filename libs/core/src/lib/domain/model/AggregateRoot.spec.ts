import { AggregateRoot } from './AggregateRoot'
import { BaseEntityProps } from './Entity'
import { MessageBus } from './Bus'
import { Event } from './Message'

class TestEvent extends Event<any> {
  constructor() {
    super({
      id: '1',
      type: 'TEST_EVENT',
      payload: {},
      metadata: {},
      timestamp: Date.now(),
    })
  }
}

class TestAggregate extends AggregateRoot<BaseEntityProps<string>, string> {
  public addEvent(): void {
    this.addDomainEvent(new TestEvent())
  }
}

describe('AggregateRootSpec', () => {
  let aggregate: TestAggregate
  let messageBus: MessageBus

  beforeEach(() => {
    aggregate = new TestAggregate({
      id: '1',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
    messageBus = {
      publishEvent: jest.fn().mockResolvedValue(undefined),
    } as unknown as MessageBus
  })

  it('should be defined', () => {
    aggregate.addEvent()
    expect(aggregate).toBeDefined()
  })

  it('should publish domain events', async () => {
    aggregate.addEvent()
    await aggregate.publishDomainEvents(messageBus)
    expect(messageBus.publishEvent).toHaveBeenCalled()
  })
})
