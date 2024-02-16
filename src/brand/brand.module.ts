import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  providers: [BrandService, PrismaService],
  exports: [BrandService],
  controllers: [BrandController],
  imports: [CacheModule.register()],
})
export class BrandModule {}
