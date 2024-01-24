import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IRegister } from './dtos/register';
import { UserService } from 'src/user/user.service';
import { ILogin } from './dtos/login';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User, Token } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(dto: IRegister) {
    return this.userService.createUser(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: ILogin): Promise<any> {
    const user: User = await this.userService
      .findUser(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Incorrect login or password');
    }
  }

  private async getRefreshToken(): Promise<any> {
    return this.prismaService.user;
  }

  //   private async generateTokens(user: User, agent: string): Promise<Tokens> {
  //     const accessToken =
  //       'Bearer ' +
  //       this.jwtService.sign({
  //         id: user.id,
  //         email: user.email,
  //         roles: user.roles,
  //       });
  //     const refreshToken = await this.getRefreshToken(user.id, agent);
  //     return { accessToken, refreshToken };
  //   }
}
