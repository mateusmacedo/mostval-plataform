import { ValueObject, Primitives } from './ValueObject'

type IdentifierProps<T> = {
  value: T extends Primitives | Primitives[] ? T : never
}

export class Identifier<T extends Primitives | Primitives[]>
  implements ValueObject<IdentifierProps<T>>
{
  private readonly props: IdentifierProps<T>

  constructor(value: T) {
    if (value === null || value === undefined) {
      throw new Error('O identificador não pode ser nulo ou indefinido')
    }
    this.props = { value } as IdentifierProps<T>
  }

  public equals(vo?: ValueObject<IdentifierProps<T>>): boolean {
    if (!vo) {
      return false
    }
    if (vo.constructor !== this.constructor) {
      return false
    }
    return vo.toValue().value === this.props.value
  }

  public toString(): string {
    return String(this.props.value)
  }

  public toValue(): IdentifierProps<T> {
    return Object.freeze({ ...this.props })
  }

  public getValue(): T {
    return this.props.value
  }

  public static isValid(value: unknown): boolean {
    return value !== null && value !== undefined
  }
}
