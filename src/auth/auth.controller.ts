import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { Public, UserAgent } from '../decorators';
import { Token } from '../decorators/getvalidToken';
import { CreateUserDto } from '../user/dto/createUser';

import { AuthService } from './auth.service';
import { LoginDto, TokenDto } from './dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';
import { UserDto } from '../user/dto/user';

@Public()
@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);
    if (!user) {
      throw new BadRequestException(
        `Unable to register a user with data ${JSON.stringify(dto)}`,
      );
    }
    return classToPlain(UserDto, user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokenDto })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  async logout(@Token('token') token: string) {
    return this.authService.deleteToken(token);
  }

  @Get('refresh-tokens/:refreshToken')
  @ApiOperation({ summary: "Refresh token when token's user expired" })
  @ApiOkResponse({ type: TokenDto })
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

  /*    this comment use in feature for  sign in through google      */

  //   @UseGuards(GoogleGuard)
  //   @Get('google')
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   googleAuth() {}
  //
  //   @UseGuards(GoogleGuard)
  //   @Get('google/callback')
  //   googleAuthCallback(@Req() req: Request, @Res() res: Response) {
  //     const token = req.user['accessToken'];
  //     return res.redirect(`ACCESS_TOKEN_GOOGLE${token}`);
  //   }

  /*    this comment use in feature for  get user in google account      */

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
