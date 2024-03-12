import { BaseEntity, BaseEntityProps } from './Entity';

type EntityProps = {
  myProp: string;
} & BaseEntityProps<string>;

class EntitySpec extends BaseEntity<EntityProps, string> {
  constructor(props: EntityProps) {
    super(props);
  }
}

describe('EntitySpec', () => {
  let entitySpec: EntitySpec;

  beforeEach(async () => {
    const myEntityProps: EntityProps = {
      id: 'test',
      version: 0,
      createdAt: new Date('1970-01-01'),
      updatedAt: new Date('1970-01-01'),
      deletedAt: null,
      myProp: 'test',
    };
    entitySpec = new EntitySpec(myEntityProps);
  });

  it('should be defined', () => {
    expect(entitySpec).toBeDefined();
  });

  it('should return the id', () => {
    expect(entitySpec.id).toEqual('test');
  });

  it('should return the version', () => {
    expect(entitySpec.version).toEqual(0);
  });

  it('should increment the version', () => {
    entitySpec.incrementVersion();
    expect(entitySpec.version).toEqual(1);
    expect(entitySpec.updatedAt.getTime()).toBeGreaterThan(entitySpec.createdAt.getTime());
  });

  it('should return the createdAt date', () => {
    expect(entitySpec.createdAt).toBeInstanceOf(Date);
  });

  it('should return the updatedAt date', () => {
    expect(entitySpec.updatedAt).toBeInstanceOf(Date);
  });

  it('should return the deletedAt date', () => {
    expect(entitySpec.deletedAt).toBeNull();
  });

  it('should return the myProp', () => {
    expect(entitySpec.props.myProp).toEqual('test');
  });
});
