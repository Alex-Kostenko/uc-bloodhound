import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';

import { AuthService } from '@/auth/auth.service';
import { LoginDto, TokenDto } from '@/auth/dto';
import { Public, UserAgent } from '@/decorators';
import { Token } from '@/decorators/getvalidToken';
import { CreateUserDto } from '@/user/dto/createUser';
import { UserDto } from '@/user/dto/user';

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
    await this.authService.deleteToken(token);
  }

  @Get('refresh-tokens/:refreshToken')
  @ApiOperation({ summary: "Refresh token when token's user expired" })
  @ApiOkResponse({ type: TokenDto })
  async refreshTokens(
    @UserAgent() agent: string,
    @Param('refreshToken') refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new BadRequestException();
    }
    const tokens = await this.authService.refreshTokens(refreshToken, agent);
    if (!tokens) {
      throw new BadRequestException();
    }
    return tokens;
  }
}
