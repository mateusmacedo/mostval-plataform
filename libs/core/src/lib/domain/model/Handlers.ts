import { Result } from '../../application'
import { Command, Event, Message, Query } from './Message'

export interface IHandler<T extends Message<any>, R, E extends Error> {
  canHandle(message: T): boolean
  handle(message: T): Result<R, E>
  asyncHandle(message: T): Promise<Result<R, E>>
}

export interface CommandHandler extends IHandler<Command<any, any>, void, Error> {}

export interface QueryHandler extends IHandler<Query<any, any>, any, Error> {}

export interface EventHandler extends IHandler<Event<any, any>, void, Error> {}

export interface IPublisher<T extends Message<any>> {
  publish(message: T): Result<void, Error>
}

export interface ISubscriber<T extends Message<any>> {
  subscribe(handler: IHandler<T, any, any>): Result<void, Error>
}

export interface IChannel<T extends Message<any>> extends IPublisher<T>, ISubscriber<T> {}

export interface IBus<T extends Message<any>> extends IPublisher<T>, ISubscriber<T> {
  registerChannel(channel: IChannel<T>): Result<void, Error>
}

export interface RetryPolicy {
  retries: number
  interval: number
}

export class RetryableHandler<T extends Message<any>, R, E extends Error>
  implements IHandler<T, R, E>
{
  constructor(
    private handler: IHandler<T, R, E>,
    private policy: RetryPolicy,
  ) {}

  canHandle(message: T): boolean {
    return this.handler.canHandle(message)
  }

  handle(message: T): Result<R, E> {
    return this.handler.handle(message)
  }

  async asyncHandle(message: T): Promise<Result<R, E>> {
    let attempts = 0
    const tryHandling = async (): Promise<Result<R, E>> => {
      try {
        return await this.handler.asyncHandle(message)
      } catch (error) {
        if (attempts < this.policy.retries) {
          attempts++
          await new Promise((resolve) => setTimeout(resolve, this.policy.interval))
          return await tryHandling()
        } else {
          return Result.failure<R, E>(error as E)
        }
      }
    }
    return await tryHandling()
  }
}

export interface CircuitBreakerPolicy {
  failureThreshold: number
  cooldownPeriod: number
  resetTimeout: number
}

export class CircuitBreakerHandler<T extends Message<any>, R, E extends Error>
  implements IHandler<T, R, E>
{
  private state: 'CLOSED' | 'OPEN' | 'HALF-OPEN' = 'CLOSED'
  private failureCount = 0
  private nextAttempt = Date.now()

  constructor(
    private handler: IHandler<T, R, E>,
    private policy: CircuitBreakerPolicy,
  ) {}

  canHandle(message: T): boolean {
    return this.handler.canHandle(message)
  }

  handle(message: T): Result<R, E> {
    return this.handler.handle(message)
  }

  async asyncHandle(message: T): Promise<Result<R, E>> {
    if (this.state === 'OPEN' && Date.now() < this.nextAttempt) {
      return Result.failure<R, E>(new Error('Circuit breaker is open') as E)
    }

    if (this.state === 'OPEN') {
      this.state = 'HALF-OPEN'
    }

    try {
      const result = await this.handler.asyncHandle(message)
      this.reset()
      return result
    } catch (error) {
      this.recordFailure()
      if (this.state === 'HALF-OPEN' || this.failureCount >= this.policy.failureThreshold) {
        this.open()
      }
      return Result.failure<R, E>(error as E)
    }
  }

  private reset() {
    this.state = 'CLOSED'
    this.failureCount = 0
  }

  private open() {
    this.state = 'OPEN'
    this.nextAttempt = Date.now() + this.policy.cooldownPeriod
  }

  private recordFailure() {
    this.failureCount++
  }
}
