import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { options } from '@/auth/config';
import { STRATEGIES } from '@/auth/strategies';
import { UserModule } from '@/user/user.module';

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
