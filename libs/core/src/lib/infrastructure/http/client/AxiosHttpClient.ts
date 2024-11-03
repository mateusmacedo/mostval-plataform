import axios, { AxiosRequestConfig } from 'axios';

import { HttpClientInterface, HttpClientProps, Result } from './HttpClientInterface';

export class AxiosHttpClient implements HttpClientInterface {
  private clientConfig: AxiosRequestConfig;

  constructor(private config: HttpClientProps = {}) {
    this.clientConfig = {
      baseURL: config.baseUrl,
      headers: config.headers,
      responseType: config.responseType ?? 'json',
      timeout: config.requestTimeout,
    };

    // Configuração dos interceptors, se fornecidos
    if (config.requestInterceptor) {
      axios.interceptors.request.use(config.requestInterceptor);
    }
    if (config.responseInterceptor) {
      axios.interceptors.response.use(config.responseInterceptor);
    }
  }

  private async request<TResponse>(
    method: string,
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse>> {
    try {
      const response = await axios.request<TResponse>({
        ...this.clientConfig,
        method,
        url,
        data,
        headers: { ...this.clientConfig.headers, ...headers },
      });

      return {
        success: true,
        data: {
          status: response.status,
          data: response.data,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: new Error(
          JSON.stringify({
            status: error?.response?.status ?? 500,
            data: error?.response?.data ?? 'Erro Interno',
          }),
        ),
      };
    }
  }

  get<TResponse>(uri: string, headers?: Record<string, string>): Promise<Result<TResponse>> {
    return this.request<TResponse>('get', uri, undefined, headers);
  }

  post<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse>> {
    return this.request<TResponse>('post', uri, data, headers);
  }

  put<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse>> {
    return this.request<TResponse>('put', uri, data, headers);
  }

  delete<TResponse>(uri: string, headers?: Record<string, string>): Promise<Result<TResponse>> {
    return this.request<TResponse>('delete', uri, undefined, headers);
  }

  patch<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse>> {
    return this.request<TResponse>('patch', uri, data, headers);
  }
}
