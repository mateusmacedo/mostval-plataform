import { AbstractError, ErrorMessage } from './AbstractError';

export class NotFoundError extends AbstractError<ErrorMessage> {
  constructor(message: ErrorMessage) {
    super(message);
    this.name = 'NotFoundError';
  }
}