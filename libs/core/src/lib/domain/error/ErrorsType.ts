import { ConflictError } from './ConflictError'
import { DependencyError } from './DependencyError'
import { InternalError } from './InternalError'
import { InvalidDataError } from './InvalidDataError'
import { NotFoundError } from './NotFoundError'
import { ValidationError } from './ValidationError'

export enum ErrorCode {
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION = 400,
  DEPENDENCY = 424,
  INTERNAL = 500,
  INVALID_DATA = 422,
  PROCESSING = 422,
}

export const ERRORS = {
  notFound: NotFoundError,
  conflict: ConflictError,
  DependencyError: DependencyError,
  InternalError: InternalError,
  InvalidData: InvalidDataError,
  Validation: ValidationError,
} as const
export type ErrorsType = keyof typeof ERRORS
