import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractJWT(request);
    if (token === null) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.decode(token);
      if (payload?.userId) {
        request.user = payload.userId;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractJWT(request: Request): string | null {
    if (!request.headers?.authorization) {
      throw new UnauthorizedException();
    }
    const [type, token] = request.headers?.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
