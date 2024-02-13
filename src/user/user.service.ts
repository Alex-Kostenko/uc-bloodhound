import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, Prisma } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { Cache } from 'cache-manager';
import { convertToSecondsUtil } from '../utils';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const hashedPassword = this.hashPassword(data.password);
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async findUser(idOrEmail: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  async findOne(idOrEmail: string, isReset = false): Promise<User> {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }
    const cachedUser = await this.cacheManager.get<User>(idOrEmail);
    if (!cachedUser) {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }],
        },
      });
      if (!user) {
        throw new BadRequestException();
      }
      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToSecondsUtil(this.configService.get('JWT_EXP')),
      );

      return user;
    }

    return cachedUser;
  }

  async updateUser(params: {
    where: string;
    data: UpdateUserDto;
  }): Promise<User> {
    const { where, data } = params;

    const user = await this.prisma.user.findFirst({
      where: { id: where },
    });

    if (!user) {
      throw new Error('User is not find');
    }

    if (data.password) {
      return this.prisma.user.update({
        where: { id: where },
        data: {
          ...data,
          password: this.hashPassword(data.password),
        },
      });
    } else {
      return this.prisma.user.update({
        where: { id: where },
        data,
      });
    }
  }

  async delete(id: string) {
    await this.cacheManager.del(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
