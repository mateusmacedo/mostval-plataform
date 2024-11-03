import { Result } from '../../application';

export interface IGraphQlClient {
  query<TResponse, TVariables extends object>(
    query: string,
    variables?: TVariables,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, string>>;

  mutate<TResponse, TVariables extends object>(
    mutation: string,
    variables?: TVariables,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, string>>;
}
