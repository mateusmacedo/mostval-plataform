export type MessageMetadata<T = any> = {
  [Property in keyof T]?: T[Property];
};

export type MessagePayload<P = any> = {
  [Property in keyof P]?: P[Property];
};

export type MessageProps<P = any, M = any> = {
  id: string;
  type: string;
  payload: MessagePayload<P>;
  metadata: MessageMetadata<M>;
  timestamp: number;
};

export interface Message<P = any, M = any> {
  get id(): string;
  get type(): string;
  get payload(): MessagePayload<P>;
  get metadata(): MessageMetadata<M>;
  get timestamp(): number;
}

export abstract class BaseMessage<P = any, M = any> implements Message<P, M> {
  constructor(protected props: MessageProps<P, M>) {}

  get id(): string {
    return this.props.id;
  }

  get type(): string {
    return this.props.type;
  }

  get payload(): MessagePayload<P> {
    return this.props.payload;
  }

  get metadata(): MessageMetadata<M> {
    return this.props.metadata;
  }

  get timestamp(): number {
    return this.props.timestamp;
  }
}

export abstract class Command<P = any, M = any> extends BaseMessage<P, M> {}

export abstract class Query<P = any, M = any> extends BaseMessage<P, M> {}

export abstract class Event<P = any, M = any> extends BaseMessage<P, M> {}
