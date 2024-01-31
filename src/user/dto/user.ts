import { IsEmail, IsEnum, IsString, IsUUID, Length } from 'class-validator';

import { Provider } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty()
  @IsString()
  @Length(8, 255)
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  nickName: string;
}
