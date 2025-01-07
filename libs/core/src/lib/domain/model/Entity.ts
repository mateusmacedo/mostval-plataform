export type BaseEntityProps<ID> = {
  id: ID
  version: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export abstract class BaseEntity<TProps extends BaseEntityProps<ID>, ID> {
  protected readonly _props: TProps

  protected constructor(props: TProps) {
    this._props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? null,
      version: props.version ?? 1,
    }
  }

  public get id(): ID {
    return this._props.id
  }

  public get version(): number {
    return this._props.version
  }

  public incrementVersion(): void {
    this._props.version++
    this._props.updatedAt = new Date()
  }

  public get createdAt(): Date {
    return this._props.createdAt
  }

  public get updatedAt(): Date {
    return this._props.updatedAt
  }

  public get deletedAt(): Date | null {
    return this._props.deletedAt
  }

  public get props(): TProps {
    return this._props
  }

  public delete(): void {
    if (this._props.deletedAt) {
      throw new Error('Entity already deleted')
    }
    this._props.deletedAt = new Date()
    this.incrementVersion()
  }

  public restore(): void {
    if (!this._props.deletedAt) {
      throw new Error('Entity is not deleted')
    }
    this._props.deletedAt = null
    this.incrementVersion()
  }

  public isDeleted(): boolean {
    return !!this._props.deletedAt
  }
}
