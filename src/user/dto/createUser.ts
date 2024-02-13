import { Provider } from '.prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsEnum(Provider)
  @ApiPropertyOptional()
  @IsOptional()
  provider?: Provider;

  @IsString()
  @ApiProperty()
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
