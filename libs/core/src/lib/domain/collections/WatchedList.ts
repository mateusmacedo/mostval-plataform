export abstract class WatchedList<T> {
  protected currentItems: Map<string, T>;
  private initial: Set<string>;
  private new: Set<string>;
  private removedItems: Map<string, T>;

  constructor(initialItems?: T[]) {
    this.currentItems = new Map<string, T>();
    this.initial = new Set<string>();
    this.new = new Set<string>();
    this.removedItems = new Map<string, T>();

    initialItems?.forEach((item) => {
      const id = this.getItemId(item);
      this.currentItems.set(id, item);
      this.initial.add(id);
    });
  }

  abstract compareItems(a: T, b: T): boolean;
  abstract getItemId(item: T): string;

  public getItems(): T[] {
    return Array.from(this.currentItems.values());
  }

  public getNewItems(): T[] {
    return Array.from(this.new).map((id) => this.currentItems.get(id)!);
  }

  public getRemovedItems(): T[] {
    return Array.from(this.removedItems.values());
  }

  public exists(item: T): boolean {
    const id = this.getItemId(item);
    return this.currentItems.has(id);
  }

  public add(item: T): void {
    const id = this.getItemId(item);
    if (this.removedItems.has(id)) {
      this.removedItems.delete(id);
    }

    if (!this.new.has(id) && !this.initial.has(id)) {
      this.new.add(id);
    }

    this.currentItems.set(id, item);
  }

  public remove(item: T): void {
    const id = this.getItemId(item);
    if (this.currentItems.has(id)) {
      this.currentItems.delete(id);
      this.removedItems.set(id, item);
    }
  }
}
