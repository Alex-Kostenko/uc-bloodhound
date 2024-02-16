import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Brand } from '@prisma/client';
import { Cache } from 'cache-manager';

import { PrismaService } from '@/prisma/prisma.service';
import { convertToSecondsUtil } from '@/utils';

import { CreateBrandDto } from './dto/createBrand';
import { UpdateBrandDto } from './dto/updateBrand';

@Injectable()
export class BrandService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async createBrand(data: CreateBrandDto): Promise<Brand> {
    const existingBrand = await this.prisma.brand.findFirst({
      where: { name: data.name },
    });

    if (existingBrand) {
      throw new BadRequestException('Brand with this name already exist');
    }

    return this.prisma.brand.create({
      data,
    });
  }

  async findOne(id: string, isReset = false): Promise<Brand> {
    if (isReset) {
      await this.cacheManager.del(id);
    }
    const cachedBrand = await this.cacheManager.get<Brand>(id);
    if (!cachedBrand) {
      const brand = await this.prisma.brand.findFirst({
        where: {
          id,
        },
      });
      if (!brand) {
        throw new BadRequestException();
      }
      await this.cacheManager.set(
        id,
        brand,
        convertToSecondsUtil(this.configService.get('JWT_EXP')),
      );

      return brand;
    }

    return cachedBrand;
  }

  async delete(id: string) {
    const brand = await this.prisma.brand.findFirst({
      where: { id },
    });

    if (!brand) {
      throw new BadRequestException('Brand is not find');
    }

    await this.cacheManager.del(id);
    return this.prisma.brand.delete({
      where: { id },
    });
  }
  async getAll() {
    return await this.prisma.brand.findMany();
  }

  async updateBrand(params: {
    where: string;
    data: UpdateBrandDto;
  }): Promise<Brand> {
    const { where, data } = params;

    const brand = await this.prisma.brand.findFirst({
      where: { id: where },
    });

    if (!brand) {
      throw new BadRequestException('Brand is not find');
    }

    return this.prisma.brand.update({
      where: { id: where },
      data,
    });
  }
}
