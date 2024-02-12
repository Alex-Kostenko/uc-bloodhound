import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

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

  private async validateToken(token: string): Promise<boolean> {
    const presentToken = await this.prisma.token.findFirst({
      where: {
        OR: [{ token }],
      },
    });
    if (!presentToken) {
      throw new UnauthorizedException('Does not have token');
    }
    return !!token;
  }
}
