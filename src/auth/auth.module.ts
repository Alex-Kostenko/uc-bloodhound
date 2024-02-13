import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config';
import { STRATEGIES } from './strategies';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES],
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UserModule,
    HttpModule,
  ],
})
export class AuthModule {}
