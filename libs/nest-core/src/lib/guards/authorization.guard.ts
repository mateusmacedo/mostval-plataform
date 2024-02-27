import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE, PublicRouteOptions } from '../decorators/public-route';

@Injectable()
export class AuthorizationGuard extends AuthGuard('auth-routes') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<any>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]) as PublicRouteOptions;
    if (isPublic?.active === true) {
      return true;
    }
    return super.canActivate(context);
  }
}
