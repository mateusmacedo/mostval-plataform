export type Primitives = string | number | boolean | Date

export type ValueObjectProps<T> = {
  [Property in keyof T]: T[Property] extends Primitives | Primitives[]
    ? T[Property]
    : T[Property] extends object
      ? ValueObjectProps<T[Property]>
      : never
}

export interface ValueObject<T extends ValueObjectProps<T>> {
  equals(value?: ValueObject<T>): boolean
  toString(): string
  toValue(): ValueObjectProps<T>
}

export abstract class BaseValueObject<T extends ValueObjectProps<T>> implements ValueObject<T> {
  constructor(protected readonly props: T) {
    this.validateProps(props)
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (!vo) {
      return false
    }
    if (vo.constructor !== this.constructor) {
      return false
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.toValue())
  }

  public toString(): string {
    return JSON.stringify(this.props)
  }

  public toValue(): T {
    return Object.freeze({ ...this.props })
  }

  protected validateProps(props: T): void {
    if (!props) {
      throw new Error('As propriedades do Value Object não podem ser nulas')
    }
  }

  protected static isValidPrimitive(value: unknown): boolean {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Date
    )
  }
}
