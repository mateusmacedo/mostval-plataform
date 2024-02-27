import axios, { AxiosRequestConfig } from 'axios';
import {
  HttpClientInterface,
  HttpClientResponseProps,
  httpClientProps,
} from './HttpClientInterface';

export class AxiosHttpClient implements HttpClientInterface {
  private clientConfig!: AxiosRequestConfig;

  constructor(private config: httpClientProps = {}) {
    this.makeInstanceConfig(this.config);
  }

  private makeInstanceConfig(config: httpClientProps): void {
    this.clientConfig = {
      baseURL: config.baseUrl,
      headers: config.headers,
      responseType: config.responseType ?? 'json',
      timeout: config.requestTimeout,
    };
  }

  private async request<TResponse>(
    method: string,
    url: string,
    data?: object,
  ): Promise<HttpClientResponseProps<TResponse>> {
    try {
      const response = await axios.request({ ...this.clientConfig, method, url, data });
      return {
        status: response.status,
        data: response.data as TResponse,
      } as HttpClientResponseProps<TResponse>;
    } catch (error: any) {
      throw new Error(
        JSON.stringify({
          status: error?.response?.status ?? 500,
          data: error?.response?.data ?? 'Internal Error',
        }),
      );
    }
  }
  get<TResponse>(uri: string): Promise<HttpClientResponseProps<TResponse>> {
    return this.request('get', uri);
  }
  post<TResponse>(uri: string, data: object): Promise<HttpClientResponseProps<TResponse>> {
    return this.request('post', uri, data);
  }
  put<TResponse>(uri: string, data: object): Promise<HttpClientResponseProps<TResponse>> {
    return this.request('put', uri, data);
  }
  delete<TResponse>(uri: string): Promise<HttpClientResponseProps<TResponse>> {
    return this.request('delete', uri);
  }
  patch<TResponse>(uri: string, data: object): Promise<HttpClientResponseProps<TResponse>> {
    return this.request('patch', uri, data);
  }
}
