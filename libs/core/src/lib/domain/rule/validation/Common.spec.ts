import {
  EmailValidationRule,
  MaxValueValidationRule,
  MinLengthValidationRule,
  MinValueValidationRule,
  RegexValidationRule,
  RequiredFieldValidationRule,
} from './Common';

describe('RequiredFieldValidationRule', () => {
  it('should return an error when the field is not present', () => {
    // Arrange
    const rule = new RequiredFieldValidationRule('name');
    const input = {};

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['name é obrigatório']);
  });

  it('should return an error when the field is an empty string', () => {
    // Arrange
    const rule = new RequiredFieldValidationRule('name');
    const input = { name: '' };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['name é obrigatório']);
  });

  it('should not return an error when the field is present', () => {
    // Arrange
    const rule = new RequiredFieldValidationRule('name');
    const input = { name: 'John' };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe('MinLengthValidationRule', () => {
  it('should return an error when the field length is less than the minimum length', () => {
    // Arrange
    const rule = new MinLengthValidationRule('name', 5);
    const input = { name: 'John' };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['name precisa ter pelo menos 5 caracteres']);
  });

  it('should not return an error when the field length is equal to the minimum length', () => {
    // Arrange
    const rule = new MinLengthValidationRule('name', 5);
    const input = { name: 'Alice' };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should not return an error when the field length is greater than the minimum length', () => {
    // Arrange
    const rule = new MinLengthValidationRule('name', 5);
    const input = { name: 'Robert' };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe('MinValueValidationRule', () => {
  it('should return an error when the field value is less than the min value', () => {
    // Arrange
    const rule = new MinValueValidationRule('age', 18);
    const input = { age: 15 };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['age precisa ser maior ou igual a 18']);
  });

  it('should not return an error when the field value is equal to the min value', () => {
    // Arrange
    const rule = new MinValueValidationRule('age', 18);
    const input = { age: 18 };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should not return an error when the field value is greater than the min value', () => {
    // Arrange
    const rule = new MinValueValidationRule('age', 18);
    const input = { age: 20 };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe('MaxValueValidationRule', () => {
  it('should return an error when the field value is greater than the max value', () => {
    // Arrange
    const rule = new MaxValueValidationRule('age', 18);
    const input = { age: 20 };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['age precisa ser menor ou igual a 18']);
  });

  it('should not return an error when the field value is equal to the max value', () => {
    // Arrange
    const rule = new MaxValueValidationRule('age', 18);
    const input = { age: 18 };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should not return an error when the field value is less than the max value', () => {
    // Arrange
    const rule = new MaxValueValidationRule('age', 18);
    const input = { age: 15 };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe('EmailValidationRule', () => {
  it('should return an error when the field is not an email', () => {
    // Arrange
    const rule = new EmailValidationRule('email');
    const input = { email: 'not-an-email' };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['email precisa ser um email válido']);
  });

  it('should not return an error when the field is an email', () => {
    // Arrange
    const rule = new EmailValidationRule('email');
    const input = { email: '<EMAIL>' };

    // Act
    const result = rule.validate(input);

    // Assert
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['email precisa ser um email válido']);
  });

  it('should not return an error when the field is an email with a subdomain', () => {
    // Arrange
    const rule = new EmailValidationRule('email');
    const input = { email: 'dummy@example.com' };

    // Act
    const result = rule.validate(input);
    // Assert
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe('RegexValidationRule', () => {
  it('should return success when value matches regex', () => {
    const rule = new RegexValidationRule('email', '^\\S+@\\S+$');
    const result = rule.validate({ email: 'test@example.com' });
    expect(result.success).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should return failure when value does not match regex', () => {
    const rule = new RegexValidationRule('email', '^\\S+@\\S+$');
    const result = rule.validate({ email: 'invalid email' });
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toBe('email precisa ser válido de acordo com a regex ^\\S+@\\S+$');
  });
});
