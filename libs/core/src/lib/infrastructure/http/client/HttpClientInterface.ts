export type HttpClientResponseProps<TResponse> = {
  status: number | string;
  data?: TResponse;
};

export type HttpClientProps = {
  baseUrl?: string;
  headers?: Record<string, string>;
  responseType?: 'arraybuffer' | 'document' | 'json' | 'text' | 'stream';
  requestTimeout?: number;
  requestInterceptor?: (config: any) => Promise<any>;
  responseInterceptor?: (response: any) => Promise<any>;
};

export type Result<TResponse, TError = Error> =
  | { success: true; data: HttpClientResponseProps<TResponse> }
  | { success: false; error: TError };

export interface HttpClientInterface {
  get<TResponse>(uri: string, headers?: Record<string, string>): Promise<Result<TResponse>>;

  post<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse>>;

  put<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse>>;

  delete<TResponse>(uri: string, headers?: Record<string, string>): Promise<Result<TResponse>>;

  patch<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse>>;
}
