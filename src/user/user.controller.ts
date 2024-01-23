import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { IUser } from './dtos/userCreate';
import { IUserUpdate } from './dtos/userUpdate';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.users({});
    return users;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id): Promise<User> {
    const users = await this.userService.deleteUser(id);
    return users;
  }

  @Post()
  async createUser(@Body() createUserDto: IUser): Promise<IUser> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() createUserDto: IUserUpdate) {
    const updateUser = await this.userService.updateUser({
      where: id,
      data: createUserDto,
    });
    return updateUser;
  }
}
