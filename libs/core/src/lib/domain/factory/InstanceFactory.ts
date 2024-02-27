export type CreationOptions<T> = {
  [Property in keyof T]?: T[Property];
};

export interface DIContainer {
  register<T>(token: symbol, instance: T): void;
  resolve<T>(token: symbol): T;
}

export interface Factory {
  create<T>(
    target: new (...args: any[]) => T,
    props?: ConstructorParameters<typeof target>[0],
    optionTokens?: symbol[],
  ): T;
}

export interface PostCreationOption<T> {
  postCreate(instance: T): void;
}

export class BasicFactory implements Factory {
  constructor(private container: DIContainer) {}

  create<T>(
    target: new (...args: any[]) => T,
    props?: ConstructorParameters<typeof target>[0],
    optionTokens?: symbol[],
  ): T {
    const instance = new target(props);

    optionTokens?.forEach((token) => {
      const option: PostCreationOption<T> = this.container.resolve(token);
      option.postCreate(instance);
    });

    return instance;
  }
}
