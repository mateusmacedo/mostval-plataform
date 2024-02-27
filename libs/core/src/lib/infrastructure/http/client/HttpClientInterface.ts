export type HttpClientResponseProps<TResponse> = {
  status: number | string;
  data?: TResponse | undefined;
};
export type httpClientProps = {
  baseUrl?: string;
  headers?: { [key: string]: string };
  responseType?: 'arraybuffer' | 'document' | 'json' | 'text' | 'stream';
  requestTimeout?: number;
  requestInterceptor?: (config: any) => Promise<any>;
  responseInterceptor?: (response: any) => Promise<any>;
};
export interface HttpClientInterface {
  get<TResponse>(uri: string): Promise<HttpClientResponseProps<TResponse>>;
  post<TResponse>(uri: string, data: object): Promise<HttpClientResponseProps<TResponse>>;
  put<TResponse>(uri: string, data: object): Promise<HttpClientResponseProps<TResponse>>;
  delete<TResponse>(uri: string): Promise<HttpClientResponseProps<TResponse>>;
  patch<TResponse>(uri: string, data: object): Promise<HttpClientResponseProps<TResponse>>;
}
