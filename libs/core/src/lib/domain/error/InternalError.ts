import { AbstractError } from './AbstractError';

export class InternalError extends AbstractError<string | Array<string> | Partial<any>> {
  constructor(errorOrMessage: string | Array<string> | Partial<any>) {
    super(errorOrMessage);
  }
}
