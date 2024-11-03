export abstract class AbstractError<TError> {
  constructor(
    private errorOrMessage: TError,
    private code: number = 0,
    private previousError: AbstractError<any> | null = null,
  ) {}

  getError(): TError {
    return this.errorOrMessage;
  }

  getCode(): number | undefined {
    return this.code;
  }

  getPreviousError(): AbstractError<any> | null {
    return this.previousError;
  }
}
