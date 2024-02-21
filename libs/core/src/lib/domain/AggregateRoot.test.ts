import { AggregateRoot } from './AggregateRoot';
import { IDomainEvent } from './events/IDomainEvent';
import { Identifier } from './vo/Identifier';

class TestEvent implements IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId<T>(): Identifier<T> {
    throw new Error('Method not implemented.');
  }
}

type TestAggregateRootProps = {
  dummyProp: string;
};

type TestIdentifyType = string | number;

class TestAggregateRoot extends AggregateRoot<TestAggregateRootProps, TestIdentifyType> {
  public addTestEvent(): void {
    this.addDomainEvent(new TestEvent());
  }
}

describe('AggregateRoot', () => {
  let aggregate: TestAggregateRoot;
  let id: Identifier<TestIdentifyType>;
  let aggregateProps: TestAggregateRootProps;

  beforeEach(() => {
    id = new Identifier('testId');
    aggregateProps = { dummyProp: 'test' };
    aggregate = new TestAggregateRoot(aggregateProps, id);
  });

  it('should correctly add domain events', () => {
    aggregate.addTestEvent();
    expect(aggregate.domainEvents.length).toEqual(1);
  });

  it('should correctly clear domain events', () => {
    aggregate.addTestEvent();
    aggregate.clearEvents();
    expect(aggregate.domainEvents.length).toEqual(0);
  });

  it('should correctly return its id', () => {
    expect(aggregate.id).toEqual(id);
  });
});
