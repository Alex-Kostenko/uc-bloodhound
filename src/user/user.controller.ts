import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { JwtAuthGuard } from '@/decorators/guardToken';
import { CreateUserDto } from '@/user/dto/createUser';
import { UpdateUserDto } from '@/user/dto/updateUser';
import { UserDto } from '@/user/dto/user';
import { UserService } from '@/user/user.service';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User Controller')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ type: UserDto })
  @Get(':idOrEmail')
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);
    return plainToClass(UserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ type: UserDto })
  @ApiBody({ type: CreateUserDto })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return plainToClass(UserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.delete(id);
    return plainToClass(UserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserDto })
  @ApiBody({ type: UserDto })
  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    const updateUser = await this.userService.updateUser({
      where: id,
      data: user,
    });
    return plainToClass(UserDto, updateUser);
  }
}
