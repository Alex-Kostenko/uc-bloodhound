import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JwtPayload } from '@/auth/interfaces';

export const User = createParamDecorator(
  (
    key: keyof JwtPayload,
    ctx: ExecutionContext,
  ): JwtPayload | Partial<JwtPayload> => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
