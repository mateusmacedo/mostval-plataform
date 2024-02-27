import { MessageBus } from './Bus';
import { BaseEntity } from './Entity';
import { Event } from './Message';

export abstract class AggregateRoot<ID> extends BaseEntity<ID> {
  private domainEvents: Event<any, any>[] = [];
  constructor(id: ID, version = 0) {
    super(id, version);
  }

  protected addDomainEvent(domainEvent: Event<any, any>): void {
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
