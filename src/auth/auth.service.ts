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
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/dto/createUser';
import { UserService } from '../user/user.service';
import { v4 } from 'uuid';

import { LoginDto } from './dto';
import { Tokens } from './interfaces';

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

  //   private async updateToken(token: string, agent: string): Promise<Token> {
  //     const userJWT = await this.jwtService.decode(token);
  //     const { id, email } = userJWT;
  //
  //     const jwt = this.jwtService.sign({ id, email });
  //
  //     return this.prismaService.token.upsert({
  //       where: { token },
  //       update: {
  //         token: jwt,
  //         exp: add(new Date(), { months: 1 }),
  //       },
  //       create: {
  //         token: jwt,
  //         exp: add(new Date(), { months: 1 }),
  //         userId: id,
  //         userAgent: agent,
  //         refresh: v4(),
  //       },
  //     });
  //   }

  async deleteToken(token: string) {
    const tokenUser = await this.prismaService.token.findFirst({
      where: { token },
    });

    if (!tokenUser) {
      throw new UnauthorizedException('Token does not found');
    }

    await this.prismaService.user.update({
      where: { id: tokenUser.userId },
      data: { lastOnlineAt: new Date() },
    });

    return this.prismaService.token.delete({ where: { token } });
  }

  // async providerAuth(email: string, agent: string, provider: Provider) {
  //   const userExists = await this.userService.findOne(email);
  //   if (userExists) {
  //     const user = await this.userService
  //       .save({ email, provider })
  //       .catch((err) => {
  //         this.logger.error(err);
  //         return null;
  //       });
  //     return this.generateTokens(user, agent);
  //   }
  //   const user = await this.userService
  //     .save({ email, provider })
  //     .catch((err) => {
  //       this.logger.error(err);
  //       return null;
  //     });
  //   if (!user) {
  //     throw new HttpException(
  //       `Failed to create a user with email ${email} в Google auth`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return this.generateTokens(user, agent);
  // }
}
