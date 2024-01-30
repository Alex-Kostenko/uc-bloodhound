import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { Provider } from '.prisma/client';

const a;

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(Provider)
  provider?: Provider;

  @IsString()
  @Length(8, 255)
  password: string;

  name: string;
  lastName: string;
  city: string;
  nickName: string;
}
