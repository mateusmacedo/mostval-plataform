export type BaseEntityProps<ID> = {
  id: ID;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export abstract class BaseEntity<T extends BaseEntityProps<ID>, ID> {
  protected _props: T;

  constructor(props: T) {
    this._props = props;
  }

  public get id(): ID {
    return this.props.id;
  }

  public get version(): number {
    return this.props.version;
  }

  public incrementVersion(): void {
    this.props.version++;
    this.props.updatedAt = new Date();
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  public get props(): T {
    return this._props;
  }
}
