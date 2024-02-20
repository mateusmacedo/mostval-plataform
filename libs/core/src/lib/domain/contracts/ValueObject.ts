export interface ValueObjectProps {
  [index: string]: any;
}

export interface IValueObject<T> {
  equals(value: IValueObject<T>): boolean;
  toString(): string;
  toValue(): T;
}

export abstract class ValueObject<T extends ValueObjectProps> implements IValueObject<T> {
  public props: T;

  constructor(props: T) {
    const baseProps: any = {
      ...props,
    };

    this.props = baseProps;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    if (!(vo instanceof this.constructor)) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  public toString(): string {
    return JSON.stringify(this.props);
  }

  public toValue(): T {
    return this.props;
  }
}
