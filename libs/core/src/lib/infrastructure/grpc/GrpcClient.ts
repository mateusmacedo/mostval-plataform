import { Result } from '../../application';

export interface IGrpcClient {
  unaryCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
  ): Promise<Result<TResponse, Error>>;
  serverStreamingCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
  ): AsyncIterable<Result<TResponse, Error>>;
}
