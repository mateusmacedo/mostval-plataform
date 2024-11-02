export class Result<T, E = string> {
  private constructor(
    private readonly success: boolean,
    private readonly error?: E,
    private readonly value?: T,
  ) {
    Object.freeze(this);
  }

  public get isSuccess(): boolean {
    return this.success;
  }

  public get isFailure(): boolean {
    return !this.success;
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error('Cannot get the value of a failed result.');
    }
    return this.value as T;
  }

  public getError(): E {
    if (this.isSuccess) {
      throw new Error('Cannot get the error of a successful result.');
    }
    return this.error as E;
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static failure<U = never, E = unknown>(error: E): Result<U, E> {
    if (error === undefined) {
      throw new Error('Error cannot be undefined');
    }
    return new Result<U, E>(false, error);
  }

  public static combine(...results: Array<Result<unknown, unknown>>): Result<unknown, unknown> {
    const errors = results.filter((result) => result.isFailure).map((result) => result.getError());
    return errors.length > 0 ? Result.failure(errors) : Result.success();
  }

  public async andThenAsync<U>(func: (value: T) => Promise<Result<U, E>>): Promise<Result<U, E>> {
    if (this.isFailure) {
      return Result.failure<U, E>(this.getError());
    }
    return await func(this.getValue());
  }

  public andThen<U>(func: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isFailure) {
      return Result.failure<U, E>(this.getError());
    }
    return func(this.getValue());
  }

  public onFailure(func: (error: E) => void): Result<T, E> {
    if (this.isFailure) {
      func(this.getError());
    }
    return this;
  }

  public onSuccess(func: (value: T) => void): Result<T, E> {
    if (this.isSuccess) {
      func(this.getValue());
    }
    return this;
  }
}

export type ResultOk<T> = Result<T, never>;
export type ResultFail<E> = Result<never, E>;
export type ResultOr<T, E> = Result<T, E>;
