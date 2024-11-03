import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { Result } from '../../application';
import { IGrpcClient } from './GrpcClient';

export class GrpcClient implements IGrpcClient {
  private readonly client: grpc.Client;

  constructor(
    protoPath: string,
    packageName: string,
    serviceName: string,
    address: string,
    credentialsOptions?: grpc.ChannelCredentials,
  ) {
    const packageDefinition: protoLoader.PackageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const grpcObject = grpc.loadPackageDefinition(packageDefinition);
    const packageObject = grpcObject[packageName] as grpc.GrpcObject;

    const serviceConstructor = packageObject[serviceName] as grpc.ServiceClientConstructor;

    this.client = new serviceConstructor(
      address,
      credentialsOptions || grpc.credentials.createInsecure(),
    );
  }

  public async unaryCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
  ): Promise<Result<TResponse, Error>> {
    return new Promise<Result<TResponse, Error>>((resolve) => {
      (this.client as any)[method](
        request,
        (error: grpc.ServiceError | null, response: TResponse) => {
          if (error) {
            resolve(Result.failure<TResponse, Error>(error));
          } else {
            resolve(Result.success<TResponse, Error>(response));
          }
        },
      );
    });
  }

  public serverStreamingCall<TRequest, TResponse>(
    method: string,
    request: TRequest,
  ): AsyncIterable<Result<TResponse, Error>> {
    const call: grpc.ClientReadableStream<TResponse> = (this.client as any)[method](request);

    const asyncIterable = {
      [Symbol.asyncIterator](): AsyncIterator<Result<TResponse, Error>> {
        return {
          next(): Promise<IteratorResult<Result<TResponse, Error>>> {
            return new Promise((resolve) => {
              call.once('data', (data: TResponse) => {
                resolve({ value: Result.success<TResponse>(data), done: false });
              });

              call.once('error', (error: grpc.ServiceError) => {
                resolve({ value: Result.failure<TResponse, Error>(error), done: false });
              });

              call.once('end', () => {
                resolve({ value: null as any, done: true });
              });
            });
          },
        };
      },
    };

    return asyncIterable as AsyncIterable<Result<TResponse, Error>>;
  }
}
