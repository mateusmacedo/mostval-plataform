import { MessageBus } from './Bus';
import { BaseEntity, BaseEntityProps } from './Entity';
import { Event } from './Message';

export abstract class AggregateRoot<T extends BaseEntityProps<ID>, ID> extends BaseEntity<T, ID> {
  private domainEvents: Event<unknown, unknown>[] = [];
  constructor(props: T) {
    super(props);
  }

  protected addDomainEvent(domainEvent: Event<unknown, unknown>): void {
    this.domainEvents.push(domainEvent);
  }

  async publishDomainEvents(messageBus: MessageBus): Promise<void> {
    while (this.domainEvents.length > 0) {
      const domainEvent = this.domainEvents.shift();
      if (domainEvent) {
        await messageBus.publishEvent(domainEvent);
      }
    }
  }
}
