export type ValueObjectProps<T> = {
  [Property in keyof T]?: T[Property];
};

export interface ValueObject<T extends ValueObjectProps<T>> {
  equals(value: ValueObject<T>): boolean;
  toString(): string;
  toValue(): ValueObjectProps<T>;
}

export abstract class BaseValueObject<T> implements ValueObject<T> {
  constructor(protected props: ValueObjectProps<T>) {}

  public equals(vo: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }
    if (vo.toValue() === null || vo.toValue() === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.toValue());
  }

  public toString(): string {
    return JSON.stringify(this.props);
  }

  public toValue(): ValueObjectProps<T> {
    return this.props;
  }
}
