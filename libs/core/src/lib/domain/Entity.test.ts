import { Entity } from './Entity';
import { Identifier } from './vo/Identifier';

describe('Entity', () => {
  class TestEntityProps {
    constructor(public readonly name: string) {}
  }

  class TestEntity extends Entity<TestEntityProps, string> {
    constructor(props: TestEntityProps, id: Identifier<string>) {
      super(props, id);
    }

    public updateName(name: string): void {
      this.updateProps(() => new TestEntityProps(name));
    }
  }

  it('should create an instance with the provided props and id', () => {
    const idValue = '123';
    const props = new TestEntityProps('Test Entity');
    const entity = new TestEntity(props, new Identifier(idValue));
    expect(entity.props).toEqual(props);
    expect(entity['_id'].toValue()).toEqual(idValue);
  });

  it('should return true when comparing two equal entities', () => {
    const idValue = '123';
    const props = new TestEntityProps('Test Entity');
    const entity1 = new TestEntity(props, new Identifier(idValue));
    const entity2 = new TestEntity(props, new Identifier(idValue));
    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should return false when comparing with itself', () => {
    const idValue = '123';
    const props = new TestEntityProps('Test Entity');
    const entity = new TestEntity(props, new Identifier(idValue));
    expect(entity.equals(entity)).toBe(true);
  });

  it('should return false when comparing with null or undefined', () => {
    const idValue = '123';
    const props = new TestEntityProps('Test Entity');
    const entity = new TestEntity(props, new Identifier(idValue));
    expect(entity.equals(null)).toBe(false);
    expect(entity.equals(undefined)).toBe(false);
  });

  it('should return false when comparing with an entity of a different class', () => {
    class OtherEntityProps {
      constructor(public readonly name: string) {}
    }

    class OtherEntity extends Entity<OtherEntityProps, string> {
      constructor(props: OtherEntityProps, id: Identifier<string>) {
        super(props, id);
      }
    }

    const idValue = '123';
    const props = new TestEntityProps('Test Entity');
    const entity1 = new TestEntity(props, new Identifier(idValue));
    const entity2 = new OtherEntity(props, new Identifier(idValue));
    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should return false when comparing with an entity of a different id', () => {
    const props = new TestEntityProps('Test Entity');
    const entity1 = new TestEntity(props, new Identifier('123'));
    const entity2 = new TestEntity(props, new Identifier('456'));
    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should return false when comparing with an different class', () => {
    const idValue = '123';
    const props = new TestEntityProps('Test Entity');
    const entity = new TestEntity(props, new Identifier(idValue));
    expect(entity.equals({} as any)).toBe(false);
  });

  it('should update entity properties when calling the updateProps method', () => {
    const idValue = '123';
    const props = new TestEntityProps('Test Entity');
    const entity = new TestEntity(props, new Identifier(idValue));

    const updatedName = 'Updated Entity';
    entity.updateName(updatedName);

    expect(entity.props.name).toEqual(updatedName);
  });
});
