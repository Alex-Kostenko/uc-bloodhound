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

import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../decorators/guardToken';
import { UserDto } from './dto/user';

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
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ type: UserDto })
  @ApiBody({ type: CreateUserDto })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.delete(id);
    const userWithoutPassword = { ...user, password: undefined };
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserDto })
  @ApiBody({ type: UpdateUserDto })
  @Patch('/update:id')
  async update(@Param('id') id, @Body() createUserDto: UpdateUserDto) {
    const updateUser = await this.userService.updateUser({
      where: id,
      data: createUserDto,
    });
    return updateUser;
  }
}
