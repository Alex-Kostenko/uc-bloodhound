import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { options } from './connfig';
import { HttpModule } from '@nestjs/axios';
import { STRTAGIES } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRTAGIES],
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UserModule,
    HttpModule,
  ],
})
export class AuthModule {}
