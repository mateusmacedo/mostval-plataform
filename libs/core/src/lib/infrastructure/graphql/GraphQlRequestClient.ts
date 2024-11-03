import { GraphQLClient } from 'graphql-request';

import { Result } from '../../application';
import { IGraphQlClient } from './Graphql';

export class GraphQlRequestClient implements IGraphQlClient {
  private readonly client: GraphQLClient;

  constructor(endpoint: string, defaultHeaders?: Record<string, string>) {
    this.client = new GraphQLClient(endpoint, {
      headers: defaultHeaders,
    });
  }

  public async query<TResponse, TVariables extends object>(
    query: string,
    variables?: TVariables,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, string>> {
    try {
      const response = await this.client.request<TResponse>(query, variables, headers);
      return Result.success<TResponse>(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return Result.failure<TResponse, string>(errorMessage);
    }
  }

  public async mutate<TResponse, TVariables extends object>(
    mutation: string,
    variables?: TVariables,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, string>> {
    return this.query<TResponse, TVariables>(mutation, variables, headers);
  }
}
