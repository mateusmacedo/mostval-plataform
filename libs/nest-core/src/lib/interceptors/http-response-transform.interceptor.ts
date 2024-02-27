import { HttpResponseProps } from '@mention/core';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class HttpResponseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: HttpResponseProps) => {
        const { status } = data;
        if (!status) throw new Error('http status code invalido.');
        if (status >= 500 && status < 600) throw new HttpException(data, status); // Fix: Convert status to number

        context.switchToHttp().getResponse().status(HttpStatus).json(data.data);
      }),
    );
  }
}
