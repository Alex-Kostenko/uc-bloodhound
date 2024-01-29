import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, Prisma } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { Cache } from 'cache-manager';
import { convertToSecondsUtil } from 'src/utils';

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

  async createUser(data: CreateUserDto) {
    const hashedPassword = this.hashPassword(data.password);
    const newData = { ...data };
    newData.password = hashedPassword;
    const user = await this.prisma.user.create({
      data: newData,
    });
    const userWithoutPassword = { ...user, password: undefined };

    return userWithoutPassword;
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
    const user = await this.cacheManager.get<User>(idOrEmail);
    if (!user) {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }],
        },
      });
      if (!user) {
        return null;
      }
      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToSecondsUtil(this.configService.get('JWT_EXP')),
      );
      return user;
    }
    return user;
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
    await Promise.all([this.cacheManager.del(id)]);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
