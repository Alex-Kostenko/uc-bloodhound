import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class BrandDto {
  @IsUUID()
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  popular: number;

  @ApiProperty()
  @IsString()
  logo: string;
}
