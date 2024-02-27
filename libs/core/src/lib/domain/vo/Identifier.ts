import { ValueObject } from './ValueObject';

export class Identifier<T> implements ValueObject<T> {
  constructor(private value: T) {
    this.value = value;
  }

  equals(id: Identifier<T>): boolean {
    if (id.constructor.name !== this.constructor.name) {
      return false;
    }
    return id.toValue() === this.value;
  }

  toString() {
    return String(this.value);
  }

  toValue(): T {
    return this.value;
  }
}
