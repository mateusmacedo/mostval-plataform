import {
  ConflictError,
  DependencyError,
  InternalError,
  InvalidDataError,
  NotFoundError,
  ValidationError,
} from '../../domain';
import { HttpResponse, HttpResponseProps } from './HttpResponse';

export abstract class AbstractController {
  protected processError(errorResult): HttpResponseProps {
    const notFoundErrors = [NotFoundError];
    const badRequestErrors = [ValidationError, InvalidDataError];
    const conflictErrors = [ConflictError];
    const serviceUnavailableErrors = [DependencyError];
    const unprocessableEntityErrors = [DependencyError];
    const internalError = [InternalError];

    if (conflictErrors.includes(errorResult.constructor)) {
      return HttpResponse.conflict(errorResult.getError());
    }

    if (serviceUnavailableErrors.includes(errorResult.constructor)) {
      return HttpResponse.serviceUnavailable(errorResult.getError());
    }

    if (badRequestErrors.includes(errorResult.constructor)) {
      return HttpResponse.badRequest(errorResult.getError());
    }

    if (unprocessableEntityErrors.includes(errorResult.constructor)) {
      return HttpResponse.unprocessableEntityError(errorResult.getError());
    }

    if (notFoundErrors.includes(errorResult.constructor)) {
      return HttpResponse.notFound(errorResult.getError());
    }

    if (internalError.includes(errorResult.constructor)) {
      return HttpResponse.internalServerError('error during processing the request');
    }
  }
}
