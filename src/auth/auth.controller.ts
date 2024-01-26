import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { GoogleGuard } from './guargs/google.guard';
import { Cookie, Public, UserAgent } from 'src/decorators';
import { UserResponse } from 'src/user/responses';
import { Token } from 'src/decorators/getvalidToken';

const REFRESH_TOKEN = 'refreshtoken';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    if (!user) {
      throw new BadRequestException(
        `Unable to register a user with data ${JSON.stringify(dto)}`,
      );
    }
    return new UserResponse(user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @UserAgent() agent: string) {
    const tokens = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new BadRequestException(
        `Can't get login in with the data ${JSON.stringify(dto)}`,
      );
    }
    return tokens;
  }

  @Get('logout')
  async logout(@Token('token') token: any, @Req() req: Request) {
    const user = req.user;

    const deleteToken = await this.authService.deleteToken(token);

    return deleteToken;
  }

  @Get('refresh-tokens/:refreshToken')
  async refreshTokens(
    @UserAgent() agent: string,
    @Param('refreshToken') refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.refreshTokens(refreshToken, agent);
    if (!tokens) {
      throw new UnauthorizedException();
    }
    return tokens;
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = req.user['accessToken'];
    return res.redirect(
      `http://localhost:3000/api/auth/success-google?token=${token}`,
    );
  }

  // @Get('success-google')
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // successGoogle(
  //   @Query('token') token: string,
  //   @UserAgent() agent: string,
  //   @Res() res: Response,
  // ) {
  //   return this.httpService
  //     .get(
  //       `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
  //     )
  //     .pipe(
  //       mergeMap(({ data: { email } }) =>
  //         this.authService.providerAuth(email, agent, Provider.GOOGLE),
  //       ),
  //       map((data) => this.setRefreshTokenToCookies(data, res)),
  //       handleTimeoutAndErrors(),
  //     );
  // }
}
