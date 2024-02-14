import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { add } from 'date-fns';
import { v4 } from 'uuid';

import { LoginDto } from '@/auth/dto';
import { Tokens } from '@/auth/interfaces';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/user/dto/createUser';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async refreshTokens(refresh: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.findFirst({
      where: { refresh },
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    if (new Date(token.exp) > new Date()) {
      return {
        accessToken: this.createBearer(token.token),
        refreshToken: token.refresh,
      };
    }
    const user = await this.userService.findOne(token.userId);
    return this.generateTokens(user, agent);
  }

  private createBearer(token: string) {
    return `Bearer ${token}`;
  }

  async register(dto: CreateUserDto) {
    const user: User = await this.userService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (user) {
      throw new ConflictException(
        'A user with this email address has already been registered',
      );
    }
    return this.userService.createUser(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    // const user = await this.cacheManager.get<User>(idOrEmail);
    const user: User = await this.userService
      .findOne(dto.email, true)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    if (!user || user.isBlocked) {
      throw new UnauthorizedException('User is blocked');
    }
    return this.generateTokens(user, agent);
  }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const jwt = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      time: new Date(),
    });
    const token = await this.prismaService.token.create({
      data: {
        token: jwt,
        exp: add(new Date(), { days: 1 }),
        userId: user.id,
        userAgent: agent,
        refresh: v4(),
      },
    });

    const accessToken = this.createBearer(jwt);
    return { accessToken, refreshToken: token.refresh };
  }

  async deleteToken(token: string) {
    const tokenUser = await this.prismaService.token.findFirst({
      where: { token },
    });

    if (!tokenUser) {
      throw new UnauthorizedException('Token does not found');
    }

    return this.prismaService.token.delete({ where: { token } });
  }
}
