import { ValidationResult, ValidationRule } from '../Validation';

export class RequiredFieldValidationRule implements ValidationRule {
  constructor(private readonly fieldName: string) {}

  validate(input: any): ValidationResult {
    if (
      !Object.prototype.hasOwnProperty.call(input, this.fieldName) ||
      input[this.fieldName] === ''
    ) {
      return { success: false, errors: [`${this.fieldName} é obrigatório`] };
    }
    return { success: true, errors: [] };
  }
}

export class StringValidationRule implements ValidationRule {
  validate(input: any, path = ''): ValidationResult {
    if (typeof input !== 'string') {
      return { success: false, errors: [`${path}: Expected a string`] };
    }
    return { success: true, errors: [] };
  }
}

export class MinLengthValidationRule implements ValidationRule {
  constructor(
    private readonly fieldName: string,
    private readonly minLength: number,
  ) {}

  validate(input: any): ValidationResult {
    if (input[this.fieldName].length < this.minLength) {
      return {
        success: false,
        errors: [`${this.fieldName} precisa ter pelo menos ${this.minLength} caracteres`],
      };
    }
    return { success: true, errors: [] };
  }
}

export class NumberValidationRule implements ValidationRule {
  validate(input: any, path = ''): ValidationResult {
    if (typeof input !== 'number') {
      return { success: false, errors: [`${path}: Expected a number`] };
    }
    return { success: true, errors: [] };
  }
}

export class MinValueValidationRule implements ValidationRule {
  constructor(
    private readonly fieldName: string,
    private readonly minValue: number,
  ) {}

  validate(input: any): ValidationResult {
    if (input[this.fieldName] < this.minValue) {
      return {
        success: false,
        errors: [`${this.fieldName} precisa ser maior ou igual a ${this.minValue}`],
      };
    }
    return { success: true, errors: [] };
  }
}

export class MaxValueValidationRule implements ValidationRule {
  constructor(
    private readonly fieldName: string,
    private readonly maxValue: number,
  ) {}

  validate(input: any): ValidationResult {
    if (input[this.fieldName] > this.maxValue) {
      return {
        success: false,
        errors: [`${this.fieldName} precisa ser menor ou igual a ${this.maxValue}`],
      };
    }
    return { success: true, errors: [] };
  }
}

export class EmailValidationRule implements ValidationRule {
  constructor(private readonly fieldName: string) {}

  validate(input: any): ValidationResult {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(input[this.fieldName])) {
      return { success: false, errors: [`${this.fieldName} precisa ser um email válido`] };
    }
    return { success: true, errors: [] };
  }
}

export class RegexValidationRule implements ValidationRule {
  constructor(
    private readonly fieldName: string,
    private readonly regex: string,
  ) {}

  validate(input: any): ValidationResult {
    const regex = new RegExp(this.regex);
    if (!regex.test(input[this.fieldName])) {
      return {
        success: false,
        errors: [`${this.fieldName} precisa ser válido de acordo com a regex ${this.regex}`],
      };
    }
    return { success: true, errors: [] };
  }
}
