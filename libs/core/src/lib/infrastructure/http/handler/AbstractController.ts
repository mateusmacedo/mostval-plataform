import { AbstractError } from '../../../domain'
import { HttpResponse, HttpResponseProps, HttpStatus } from './HttpResponse'

type ErrorMapping = {
  errorType: new (...args: any[]) => AbstractError<any>
  statusCode: HttpStatus
}

export abstract class AbstractController {
  private static errorMappings: ErrorMapping[] = [
    { errorType: NotFoundError, statusCode: HttpStatus.NOT_FOUND },
    { errorType: ValidationError, statusCode: HttpStatus.BAD_REQUEST },
    { errorType: InvalidDataError, statusCode: HttpStatus.BAD_REQUEST },
    { errorType: ConflictError, statusCode: HttpStatus.CONFLICT },
    { errorType: DependencyError, statusCode: HttpStatus.SERVICE_UNAVAILABLE },
  ]

  protected processError<TError>(errorResult: AbstractError<TError>): HttpResponseProps {
    const mapping = AbstractController.errorMappings.find((m) => errorResult instanceof m.errorType)

    if (mapping) {
      return HttpResponse.jsonResponse(mapping.statusCode, errorResult.getError())
    }

    return HttpResponse.internalServerError('Error during request processing')
  }
}
