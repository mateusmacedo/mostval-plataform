import { BaseEntity } from './Entity';

class EntitySpec extends BaseEntity<string> {
  constructor(id: string, version = 0) {
    super(id, version);
  }
}

describe('EntitySpec', () => {
  let entitySpec: EntitySpec;

  beforeEach(async () => {
    entitySpec = new EntitySpec('test');
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
  });
});
