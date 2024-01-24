import { Body, Controller, Post, Get } from '@nestjs/common';
import { IRegister } from './dtos/register';
import { ILogin } from './dtos/login';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() registerData: IRegister): Promise<string> {
    return 'users';
  }
  @Post('login')
  async login(@Body() dataLogin: ILogin): Promise<string> {
    return 'users';
  }
  @Get('refresh')
  async refresh(@Body() id): Promise<string> {
    return 'users';
  }
}
