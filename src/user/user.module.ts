import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
  imports: [CacheModule.register()],
})
export class UserModule {}
