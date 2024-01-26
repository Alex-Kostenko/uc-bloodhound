import { createParamDecorator } from '@nestjs/common';

export const Token = createParamDecorator(async (data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const token = request.headers.authorization?.replace('Bearer ', '');

  return token;
});
