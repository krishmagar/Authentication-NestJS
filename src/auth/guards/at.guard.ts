import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  // This method is run before the controller method is run
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the metadata for this controller method
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // If the metadata is set to true, then this method is public
    if (isPublic) {
      return true;
    }
    // Get the request object
    const request = context.switchToHttp().getRequest();
    // If the request does not have an Authorization header, throw an error
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    // If the request has an Authorization header, run the default authentication logic
    return super.canActivate(context);
  }
}
