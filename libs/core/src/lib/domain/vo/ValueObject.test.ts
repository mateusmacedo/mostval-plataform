import { BaseValueObject } from './ValueObject';

interface ValueObjectProps {
  dummy: string;
}

class TestValueObject extends BaseValueObject<ValueObjectProps> {
  constructor(props: ValueObjectProps) {
    super(props);
  }
}

describe('ValueObject', () => {
  it('should create an instance with the provided props', () => {
    const props: ValueObjectProps = {
      dummy: 'dummy',
    };
    const valueObject = new TestValueObject(props);
    expect(valueObject.toValue()).toEqual(props);
  });

  it('should return true when comparing two equal value objects', () => {
    const props: ValueObjectProps = {
      dummy: 'dummy',
    };
    const valueObject1 = new TestValueObject(props);
    const valueObject2 = new TestValueObject(props);
    expect(valueObject1.equals(valueObject2)).toBe(true);
  });

  it('should return false when comparing with null or undefined', () => {
    const props: ValueObjectProps = {
      dummy: 'dummy',
    };
    const valueObject = new TestValueObject(props);
    expect(valueObject.equals(null)).toBe(false);
    expect(valueObject.equals(undefined)).toBe(false);
  });

  it('should return false when comparing with a value object with undefined props', () => {
    const props: ValueObjectProps = {
      dummy: 'dummy',
    };
    const valueObject1 = new TestValueObject(props);
    const valueObject2 = new TestValueObject(undefined);
    expect(valueObject1.equals(valueObject2)).toBe(false);
  });

  it('should return false when comparing with a value object of a different class', () => {
    class AnotherTestValueObject extends BaseValueObject<ValueObjectProps> {
      constructor(props: ValueObjectProps) {
        super(props);
      }
    }
    const props: ValueObjectProps = {
      dummy: 'dummy',
    };
    const valueObject1 = new TestValueObject(props);
    const valueObject2 = new AnotherTestValueObject(props);
    expect(valueObject1.equals(valueObject2)).toBe(false);
  });

  it('should return false when comparing with a value object of a different value', () => {
    const props1: ValueObjectProps = {
      dummy: 'dummy',
    };
    const props2: ValueObjectProps = {
      dummy: 'dummy2',
    };
    const valueObject1 = new TestValueObject(props1);
    const valueObject2 = new TestValueObject(props2);
    expect(valueObject1.equals(valueObject2)).toBe(false);
  });

  it('should return the string representation of the value object', () => {
    const props: ValueObjectProps = {
      dummy: 'dummy',
    };
    const valueObject = new TestValueObject(props);
    expect(valueObject.toString()).toEqual(JSON.stringify(props));
  });
});
