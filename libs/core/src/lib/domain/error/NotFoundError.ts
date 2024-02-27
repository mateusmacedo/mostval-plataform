import { AbstractError } from './AbstractError';

export class NotFoundError extends AbstractError<string | Array<string>> {
  constructor(errorOrMessage: string | Array<string>) {
    super(errorOrMessage);
  }
}
