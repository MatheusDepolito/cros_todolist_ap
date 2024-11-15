import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthService, EnvService, IJwtService } from '@cros_todolist/core';
import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('EnvService')
    private readonly envService: EnvService,
    @Inject('IJwtService')
    private readonly jwtService: IJwtService,
    // @Inject('AuthService')
    // private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;

    if(!authorization) {
      throw new UnauthorizedException('auth error token badly formatted');
    }

    const [ token ] = authorization.split(' ');

    if (!token) {
      throw new UnauthorizedException(
        'auth error token badly formatted '
      );
    }

    // if (this.authService.isTokenRevoked(token)) {
    //   throw new UnauthorizedException('auth error token revoked');
    // }

    try {
      this.jwtService.verify(token, {
        secret: this.envService.e.jwt.secret,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('auth errors token expired');
      }
      
      throw new UnauthorizedException('auth errors token invalid');
    }

    return true;
  }
}