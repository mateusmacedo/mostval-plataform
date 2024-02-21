import { AggregateRoot } from '../AggregateRoot';
import { Identifier } from '../vo/Identifier';
import { IDomainEvent } from './IDomainEvent';

interface IEventDispatcher {
  dispatchEventsForAggregate(id: Identifier<any>): void;
  register<T extends IDomainEvent>(
    eventClass: { new (...args: any[]): T },
    handler: (event: T) => void,
  ): void;
  clearHandlers(): void;
}

export class EventDispatcher implements IEventDispatcher {
  private handlersMap = new Map<Function, Array<(event: IDomainEvent) => void>>();
  private markedAggregates = new Set<AggregateRoot<any, any>>();

  public markAggregateForDispatch(aggregate: AggregateRoot<any, any>): void {
    this.markedAggregates.add(aggregate);
  }

  private dispatchAggregateEvents(aggregate: AggregateRoot<any, any>): void {
    aggregate.domainEvents.forEach((event) => this.dispatch(event));
  }

  private removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any, any>): void {
    this.markedAggregates.delete(aggregate);
  }

  public dispatchEventsForAggregate(id: Identifier<any>): void {
    const aggregate = Array.from(this.markedAggregates).find((a) => a.id.equals(id));

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public register<T extends IDomainEvent>(
    eventClass: { new (...args: any[]): T },
    handler: (event: T) => void,
  ): void {
    const handlers = this.handlersMap.get(eventClass) || [];
    handlers.push(handler);
    this.handlersMap.set(eventClass, handlers);
  }

  public clearHandlers(): void {
    this.handlersMap.clear();
  }

  public clearMarkedAggregates(): void {
    this.markedAggregates.clear();
  }

  private dispatch(event: IDomainEvent): void {
    const handlers = this.handlersMap.get(
      event.constructor as { new (...args: any[]): IDomainEvent },
    );
    handlers?.forEach((handler) => handler(event));
  }
}
