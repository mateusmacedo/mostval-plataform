export abstract class BaseEntity<ID> {
  protected readonly _id: ID;
  private _version: number;

  constructor(id: ID, version = 0) {
    this._id = id;
    this._version = version;
  }

  get id(): ID {
    return this._id;
  }

  get version(): number {
    return this._version;
  }

  incrementVersion(): void {
    this._version += 1;
  }
}
