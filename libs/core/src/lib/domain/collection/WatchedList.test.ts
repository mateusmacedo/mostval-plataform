import { WatchedList } from './WatchedList';

describe('WatchedList', () => {
  class TestItem {
    constructor(
      public id: string,
      public name: string,
    ) {}
  }

  class TestWatchedList extends WatchedList<TestItem> {
    compareItems(a: TestItem, b: TestItem): boolean {
      return a.id === b.id;
    }

    getItemId(item: TestItem): string {
      return item.id;
    }
  }

  let watchedList: WatchedList<TestItem>;

  beforeEach(() => {
    watchedList = new TestWatchedList();
  });

  it('should add an item to the list', () => {
    const item = new TestItem('1', 'Item 1');
    watchedList.add(item);
    expect(watchedList.getItems()).toContain(item);
  });

  it('should remove an item from the list', () => {
    const item = new TestItem('1', 'Item 1');
    watchedList.add(item);
    watchedList.remove(item);
    expect(watchedList.getItems()).not.toContain(item);
  });

  it('should mark an item as new when added', () => {
    const item = new TestItem('1', 'Item 1');
    watchedList.add(item);
    expect(watchedList.getNewItems()).toContain(item);
  });

  it('should mark an item as removed when removed', () => {
    const item = new TestItem('1', 'Item 1');
    watchedList.add(item);
    watchedList.remove(item);
    expect(watchedList.getRemovedItems()).toContain(item);
  });

  it('should not mark an item as new if it was added initially', () => {
    const item = new TestItem('1', 'Item 1');
    const initialList = new TestWatchedList([item]);
    expect(initialList.getNewItems()).not.toContain(item);
  });

  it('should return true if an item exists in the list', () => {
    const item = new TestItem('1', 'Item 1');
    watchedList.add(item);
    expect(watchedList.exists(item)).toBe(true);
  });

  it('should return false if an item does not exist in the list', () => {
    const item = new TestItem('1', 'Item 1');
    expect(watchedList.exists(item)).toBe(false);
  });

  it('should compare items correctly', () => {
    const item1 = new TestItem('1', 'Item 1');
    const item2 = new TestItem('1', 'Item 2');
    expect(watchedList.compareItems(item1, item2)).toBe(true);
  });

  it('should get the item ID correctly', () => {
    const item = new TestItem('1', 'Item 1');
    expect(watchedList.getItemId(item)).toBe('1');
  });
});
