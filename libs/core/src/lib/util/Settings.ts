export interface IOptions {
  [key: string]: unknown;
}

export interface IConfig {
  get<TValue>(key: string): TValue;
}

export abstract class BaseConfig implements IConfig, IOptions {
  protected readonly config: IOptions;

  protected constructor(config: IOptions) {
    this.config = config;
  }
  [key: string]: unknown;

  public get<TValue>(key: string): TValue {
    const value = this.config[key];
    if (value === undefined) {
      throw new Error(`Configuration key not found: ${key}`);
    }
    return value as TValue;
  }
}
