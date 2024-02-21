import { Entity } from './Entity';
import { IDomainEvent } from './events/IDomainEvent';
import { Identifier } from './vo/Identifier';

export abstract class AggregateRoot<T, K> extends Entity<T, K> {
  private _domainEvents: IDomainEvent[] = [];

  get id(): Identifier<K> {
    return this._id;
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
