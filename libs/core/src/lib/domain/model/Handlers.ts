import { Command, Event, Message, Query } from './Message';

export interface Handler<T extends Message<any, any>> {
  handle(message: T): Promise<any>;
}

export type CommandHandler<T extends Command<any, any>> = Handler<T>;

export interface QueryHandler<T extends Query<any, any>, R> extends Handler<T> {
  handle(query: T): Promise<R>;
}

export type EventHandler<T extends Event<any, any>> = Handler<T>;

export interface RetryPolicy {
  retries: number;
  interval: number;
}

export class RetryableHandler<T extends Message> implements Handler<T> {
  constructor(
    private handler: Handler<T>,
    private policy: RetryPolicy,
  ) {}

  async handle(message: T): Promise<void> {
    let attempts = 0;
    const tryHandling = async (): Promise<void> => {
      try {
        await this.handler.handle(message);
      } catch (error) {
        if (attempts < this.policy.retries) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, this.policy.interval));
          await tryHandling();
        } else {
          throw error;
        }
      }
    };
    await tryHandling();
  }
}

export interface CircuitBreakerPolicy {
  failureThreshold: number;
  cooldownPeriod: number;
  resetTimeout: number;
}

export class CircuitBreakerHandler<T extends Message> implements Handler<T> {
  private state: 'CLOSED' | 'OPEN' | 'HALF-OPEN' = 'CLOSED';
  private failureCount = 0;
  private nextAttempt = Date.now();

  constructor(
    private handler: Handler<T>,
    private policy: CircuitBreakerPolicy,
  ) {}

  async handle(message: T): Promise<void> {
    if (this.state === 'OPEN' && Date.now() < this.nextAttempt) {
      throw new Error('Circuit breaker is open');
    }

    if (this.state === 'OPEN') {
      this.state = 'HALF-OPEN';
    }

    try {
      await this.handler.handle(message);
      this.reset();
    } catch (error) {
      this.recordFailure();
      if (this.state === 'HALF-OPEN' || this.failureCount >= this.policy.failureThreshold) {
        this.open();
      }
      throw error;
    }
  }

  private reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
  }

  private open() {
    this.state = 'OPEN';
    this.nextAttempt = Date.now() + this.policy.cooldownPeriod;
  }

  private recordFailure() {
    this.failureCount++;
  }
}
