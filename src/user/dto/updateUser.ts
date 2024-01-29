import { Provider } from '.prisma/client';

import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(Provider)
  @IsOptional()
  provider?: Provider;

  @IsString()
  @Length(8, 255)
  @IsOptional()
  password?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  nickName?: string;
}
