import { Identifier } from './vo/Identifier';

const isEntity = (v: any): v is Entity<any, any> => {
  return v instanceof Entity;
};

export abstract class Entity<T, K> {
  protected readonly _id: Identifier<K>;
  public readonly props: Readonly<T>; // Ensure props are immutable

  constructor(props: T, id: Identifier<K>) {
    this._id = id ? id : new Identifier<K>(null);
    this.props = Object.freeze({ ...props });
  }

  public equals(object?: Entity<T, K>): boolean {
    if (object == null) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    if (this.constructor.name !== object.constructor.name) {
      return false;
    }

    return this._id.equals(object._id);
  }

  // Example of a method to safely update entity properties if needed
  protected updateProps(updateFn: (props: Readonly<T>) => T): void {
    const updatedProps = updateFn(this.props);
    // Validate updatedProps if necessary
    (this as any).props = Object.freeze({ ...updatedProps });
  }
}
