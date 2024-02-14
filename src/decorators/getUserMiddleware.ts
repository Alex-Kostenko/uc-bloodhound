import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    const tokenEntity = await this.prismaService.token.findFirst({
      where: { token },
    });

    const user = await this.userService.findOne(tokenEntity?.userId);

    req.user = user;

    next();
  }
}
