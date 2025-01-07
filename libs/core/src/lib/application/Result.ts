export class Result<T, E = Error> {
  private constructor(
    private readonly success: boolean,
    private readonly error?: E,
    private readonly value?: T,
  ) {
    Object.freeze(this)
  }

  public get isSuccess(): boolean {
    return this.success
  }

  public get isFailure(): boolean {
    return !this.success
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error('Cannot get the value of a failed result.')
    }
    return this.value as T
  }

  public getError(): E {
    if (this.isSuccess) {
      throw new Error('Cannot get the error of a successful result.')
    }
    return this.error as E
  }

  public static success<U, E = Error>(value?: U): Result<U, E> {
    return new Result<U, E>(true, undefined, value)
  }

  public static failure<U = never, E = unknown>(error: E): Result<U, E> {
    if (error === undefined) {
      throw new Error('Error cannot be undefined')
    }
    return new Result<U, E>(false, error)
  }

  public static combine<T, E>(...results: Array<Result<T, E>>): Result<T[], E> {
    const errors = results.filter((result) => result.isFailure)
    if (errors.length > 0) {
      return Result.failure(errors[0].getError())
    }

    const values = results.map((result) => result.getValue())
    return Result.success(values)
  }

  public async andThenAsync<U>(func: (value: T) => Promise<Result<U, E>>): Promise<Result<U, E>> {
    if (this.isFailure) {
      return Result.failure<U, E>(this.getError())
    }
    return await func(this.getValue())
  }

  public andThen<U>(func: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isFailure) {
      return Result.failure<U, E>(this.getError())
    }
    return func(this.getValue())
  }

  public onFailure(func: (error: E) => void): Result<T, E> {
    if (this.isFailure) {
      func(this.getError())
    }
    return this
  }

  public onSuccess(func: (value: T) => void): Result<T, E> {
    if (this.isSuccess) {
      func(this.getValue())
    }
    return this
  }

  public map<U>(func: (value: T) => U): Result<U, E> {
    if (this.isFailure) {
      return Result.failure(this.getError())
    }
    return Result.success(func(this.getValue()))
  }

  public mapError<F>(func: (error: E) => F): Result<T, F> {
    if (this.isSuccess) {
      return Result.success(this.getValue())
    }
    return Result.failure(func(this.getError()))
  }

  public static fromPromise<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    return promise
      .then((value) => Result.success<T, E>(value))
      .catch((error) => Result.failure<T, E>(error))
  }
}

export type ResultOk<T> = Result<T, never>
export type ResultFail<E> = Result<never, E>
export type ResultOr<T, E> = Result<T, E>
