export type CreationOptions<T> = {
  [Property in keyof T]?: T[Property]
}

export interface DIContainer {
  register<T>(token: symbol, instance: T): void
  resolve<T>(token: symbol): T
}

export interface Factory {
  create<T>(
    target: new (...args: any[]) => T,
    props?: ConstructorParameters<typeof target>[0],
    optionTokens?: symbol[],
  ): T
}

export interface PostCreationOption<T> {
  postCreate(instance: T): void
}

export interface PreCreationOption<T> {
  preCreate<C extends new (...args: any[]) => T>(props?: ConstructorParameters<C>[0]): void
}

export class BasicFactory implements Factory {
  constructor(private container: DIContainer) {}

  create<T>(
    target: new (...args: any[]) => T,
    props?: ConstructorParameters<typeof target>[0],
    optionTokens?: symbol[],
  ): T {
    optionTokens?.forEach((token) => {
      const preOption: PreCreationOption<T> = this.container.resolve(token)
      if ('preCreate' in preOption) {
        preOption.preCreate(props)
      }
    })

    const instance = new target(props)

    optionTokens?.forEach((token) => {
      const postOption: PostCreationOption<T> = this.container.resolve(token)
      if ('postCreate' in postOption) {
        postOption.postCreate(instance)
      }
    })

    return instance
  }

  createMany<T>(
    target: new (...args: any[]) => T,
    propsArray: ConstructorParameters<typeof target>[0][],
    optionTokens?: symbol[],
  ): T[] {
    return propsArray.map((props) => this.create(target, props, optionTokens))
  }
}
