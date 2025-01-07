import { MessageBus } from './Bus'
import { BaseEntity, BaseEntityProps } from './Entity'
import { Event } from './Message'

export abstract class AggregateRoot<T extends BaseEntityProps<ID>, ID> extends BaseEntity<T, ID> {
  private domainEvents: Event<unknown, unknown>[] = []

  constructor(props: T) {
    super(props)
  }

  protected addDomainEvent(domainEvent: Event<unknown, unknown>): void {
    this.domainEvents.push(domainEvent)
  }

  public clearEvents(): void {
    this.domainEvents = []
  }

  public getDomainEvents(): ReadonlyArray<Event<unknown, unknown>> {
    return this.domainEvents
  }

  async publishDomainEvents(messageBus: MessageBus): Promise<void> {
    const events = [...this.domainEvents]
    this.clearEvents()

    for (const event of events) {
      await messageBus.publishEvent(event)
    }
  }
}
