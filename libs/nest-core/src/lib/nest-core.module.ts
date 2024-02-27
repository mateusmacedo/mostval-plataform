import { Module } from '@nestjs/common';
import { AuthenticationStrategy } from './guards/authentication.strategy';
import { AuthorizationGuard } from './guards/authorization.guard';
import { HttpResponseTransformInterceptor } from './interceptors/http-response-transform.interceptor';

@Module({
  controllers: [],
  providers: [HttpResponseTransformInterceptor, AuthenticationStrategy, AuthorizationGuard],
  exports: [],
})
export class NestCoreModule {}
