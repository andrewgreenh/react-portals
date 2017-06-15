import omit from '../src/omit';

describe('omit', () => {
  it('should remove property', () => {
    // arrange
    const object = { a: 1, b: 2 };

    // act
    const result = omit(object, 'a');

    // assert
    expect(result).toEqual({ b: 2 });
  });

  it('should not return same object', () => {
    // arrange
    const object = { a: 1, b: 2 };

    // act
    const result = omit(object, 'a');

    // assert
    expect(result).not.toBe(object);
  });

  it('should work with deep objects', () => {
    // arrange
    const object = { a: 1, b: 2, inner: { a: 1, b: 2 } };

    // act
    const result = omit(object.inner, 'a');

    // assert
    expect(result).not.toBe(object.inner);
    expect(result).toEqual({ b: 2 });
    expect(object).toEqual({ a: 1, b: 2, inner: { a: 1, b: 2 } });
  });
});
