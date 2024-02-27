import { Identifier } from './Identifier';

describe('Identifier', () => {
  it('should create an instance with the provided value', () => {
    const idValue = '123';
    const id = new Identifier(idValue);
    expect(id.toValue()).toEqual(idValue);
  });

  it('should return true when comparing two equal identifiers', () => {
    const idValue = '123';
    const id1 = new Identifier(idValue);
    const id2 = new Identifier(idValue);
    expect(id1.equals(id2)).toBe(true);
  });

  it('should return false when comparing with an identifier of a different class', () => {
    class OtherIdentifier<T> extends Identifier<T> {
      constructor(value: T) {
        super(value);
      }
    }
    const idValue = '123';
    const id1 = new Identifier(idValue);
    const id2 = new OtherIdentifier(idValue);
    expect(id1.equals(id2)).toBe(false);
  });

  it('should return false when comparing with an identifier of a different value', () => {
    const id1 = new Identifier('123');
    const id2 = new Identifier('456');
    expect(id1.equals(id2)).toBe(false);
  });

  it('should return the string representation of the identifier', () => {
    const idValue = '123';
    const id = new Identifier(idValue);
    expect(id.toString()).toEqual(idValue);
  });
});
