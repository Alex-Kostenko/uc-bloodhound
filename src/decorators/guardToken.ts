import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Does not have token');
    }

    const token = request.headers.authorization?.replace('Bearer ', '');

    const isValidToken = this.validateToken(token);

    return isValidToken;
  }

  private validateToken(token: string): boolean {
    return !!token;
  }
}
