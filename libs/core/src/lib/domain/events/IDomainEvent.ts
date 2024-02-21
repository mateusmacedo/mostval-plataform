import { Identifier } from '../vo/Identifier';

export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId<T>(): Identifier<T>;
}
