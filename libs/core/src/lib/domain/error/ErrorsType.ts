import { ConflictError } from './ConflictError';
import { DependencyError } from './DependencyError';
import { InternalError } from './InternalError';
import { InvalidDataError } from './InvalidDataError';
import { NotFoundError } from './NotFoundError';
import { ValidationError } from './ValidationError';

export const ERRORS = {
  notFound: NotFoundError,
  conflict: ConflictError,
  DependencyError: DependencyError,
  InternalError: InternalError,
  InvalidData: InvalidDataError,
  Validation: ValidationError,
};
export type ErrorsType = keyof typeof ERRORS;
