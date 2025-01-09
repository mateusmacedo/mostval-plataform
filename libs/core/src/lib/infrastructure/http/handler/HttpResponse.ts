export type HttpResponseProps<TResponse = unknown> = {
  status: HttpStatus
  data: TResponse
}

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export class HttpResponse {
  static jsonResponse<TResponse>(
    status: HttpStatus,
    data?: TResponse,
  ): HttpResponseProps<TResponse> {
    return { status, data: data ?? ({} as TResponse) }
  }

  static ok<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.OK, data)
  }

  static created<TResponse>(): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.CREATED)
  }

  static noContent<TResponse>(): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.NO_CONTENT)
  }

  static notFound<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.NOT_FOUND, data)
  }

  static badRequest<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.BAD_REQUEST, data)
  }

  static serviceUnavailable<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.SERVICE_UNAVAILABLE, data)
  }

  static forbidden<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.FORBIDDEN, data)
  }

  static unautorized<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.UNAUTHORIZED, data)
  }

  static conflict<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.CONFLICT, data)
  }

  static internalServerError<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.INTERNAL_SERVER_ERROR, data)
  }

  static unprocessableEntityError<TResponse>(data: TResponse): HttpResponseProps<TResponse> {
    return HttpResponse.jsonResponse(HttpStatus.UNPROCESSABLE_ENTITY, data)
  }
}
