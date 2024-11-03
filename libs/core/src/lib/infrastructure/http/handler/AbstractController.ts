import {
  AbstractError,
  ConflictError,
  DependencyError,
  InvalidDataError,
  NotFoundError,
  ValidationError,
} from '../../../domain';
import { HttpResponse, HttpResponseProps } from './HttpResponse';

export abstract class AbstractController {
  protected processError<TError>(errorResult: AbstractError<TError>): HttpResponseProps {
    const notFoundErrors = [NotFoundError];
    const badRequestErrors = [ValidationError, InvalidDataError];
    const conflictErrors = [ConflictError];
    const serviceUnavailableErrors = [DependencyError];
    const unprocessableEntityErrors = [DependencyError];

    if (conflictErrors.some((errorClass) => errorResult instanceof errorClass)) {
      return HttpResponse.conflict(errorResult.getError());
    }

    if (serviceUnavailableErrors.some((errorClass) => errorResult instanceof errorClass)) {
      return HttpResponse.serviceUnavailable(errorResult.getError());
    }

    if (badRequestErrors.some((errorClass) => errorResult instanceof errorClass)) {
      return HttpResponse.badRequest(errorResult.getError());
    }

    if (unprocessableEntityErrors.some((errorClass) => errorResult instanceof errorClass)) {
      return HttpResponse.unprocessableEntityError(errorResult.getError());
    }

    if (notFoundErrors.some((errorClass) => errorResult instanceof errorClass)) {
      return HttpResponse.notFound(errorResult.getError());
    }

    return HttpResponse.internalServerError('error during processing the request');
  }
}
