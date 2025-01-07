import { Result } from '../../../application'

export type HttpError = {
  status: number
  message: string
  details?: unknown
}

export type HttpClientResponseProps<TResponse> = {
  status: number | string
  data?: TResponse
}

export type HttpClientProps = {
  baseUrl?: string
  headers?: Record<string, string>
  responseType?: 'arraybuffer' | 'document' | 'json' | 'text' | 'stream'
  requestTimeout?: number
  requestInterceptor?: (config: any) => Promise<any>
  responseInterceptor?: (response: any) => Promise<any>
}

export interface HttpClientInterface {
  get<TResponse>(
    uri: string,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>>

  post<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>>

  put<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>>

  delete<TResponse>(
    uri: string,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>>

  patch<TRequest, TResponse>(
    uri: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<Result<TResponse, HttpError>>
}
