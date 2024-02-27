export type ValidationResult = {
  success: boolean;
  errors: string[];
};

export interface ValidationRule {
  validate(input: any, path?: string): ValidationResult;
}

export class ObjectValidationRule implements ValidationRule {
  constructor(private rules: { [key: string]: ValidationRule }) {}

  validate(input: any, path = ''): ValidationResult {
    if (typeof input !== 'object' || Array.isArray(input) || input === null) {
      return { success: false, errors: [`${path}: Expected an object`] };
    }
    const result: ValidationResult = { success: true, errors: [] };
    for (const key in this.rules) {
      const rule = this.rules[key];
      const validation = rule.validate(input[key], `${path}.${key}`);
      if (!validation.success) {
        result.success = false;
        result.errors = result.errors.concat(validation.errors);
      }
    }
    return result;
  }
}

export class ArrayValidationRule implements ValidationRule {
  constructor(private rule: ValidationRule) {}

  validate(input: any, path = ''): ValidationResult {
    if (!Array.isArray(input)) {
      return { success: false, errors: [`${path}: Expected an array`] };
    }
    const result: ValidationResult = { success: true, errors: [] };
    input.forEach((item, index) => {
      const validation = this.rule.validate(item, `${path}[${index}]`);
      if (!validation.success) {
        result.success = false;
        result.errors = result.errors.concat(validation.errors);
      }
    });
    return result;
  }
}
