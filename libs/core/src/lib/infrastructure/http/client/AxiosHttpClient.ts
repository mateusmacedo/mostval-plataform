import axios, { AxiosError, AxiosRequestConfig } from 'axios'

import { Result } from '../../../application'
import { HttpClientInterface, HttpClientProps, HttpError } from './HttpClientInterface'

export class AxiosHttpClient implements HttpClientInterface {
  private clientConfig: AxiosRequestConfig

  constructor(private config: HttpClientProps = {}) {
    this.clientConfig = {
      baseURL: config.baseUrl,
      headers: config.headers,
      responseType: config.responseType ?? 'json',
      timeout: config.requestTimeout,
    }

    // Configuração dos interceptors, se fornecidos
    if (config.requestInterceptor) {
      axios.interceptors.request.use(config.requestInterceptor)
    }
    if (config.responseInterceptor) {
      axios.interceptors.response.use(config.responseInterceptor)
    }
  }

  private async request<TResponse>(
    method: string,
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>> {
    try {
      const response = await axios.request<TResponse>({
        ...this.clientConfig,
        method,
        url,
        data,
        headers: { ...this.clientConfig.headers, ...headers },
      })

      return Result.success(response.data)
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: any } }
        return Result.failure({
          status: axiosError.response?.status ?? 500,
          message: axiosError.response?.data ?? 'Unknown error',
          details: axiosError.response?.data,
        })
      }
      return Result.failure({
        status: 500,
        message: 'Unknown error occurred',
        details: error,
      })
    }
  }

  get<TResponse>(
    uri: string,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>> {
    return this.request<TResponse>('get', uri, undefined, headers)
  }

  post<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>> {
    return this.request<TResponse>('post', uri, data, headers)
  }

  put<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>> {
    return this.request<TResponse>('put', uri, data, headers)
  }

  delete<TResponse>(
    uri: string,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>> {
    return this.request<TResponse>('delete', uri, undefined, headers)
  }

  patch<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>> {
    return this.request<TResponse>('patch', uri, data, headers)
  }
}
