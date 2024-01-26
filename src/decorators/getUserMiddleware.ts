import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const tokenId = req.headers.authorization?.replace('Bearer ', '');

    const tokenResult = await this.prismaService.token.findFirst({
      where: { token: tokenId },
    });

    const user = await this.userService.findOne(tokenResult?.userId);
    req.user = user;

    next();
  }
}
