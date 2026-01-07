import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
  }

  @Get(':id')
  async getUser(@Param('id') id: number, @Query('token') token: string) {
    return await this.userService.getUser(token, id);
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: number) {
    return await this.userService.getProfile(id);
  }

  @Patch(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('icon_url') iconUrl: string,
    @Query('token') token: string,
  ) {
    return await this.userService.updateProfile(
      Number(id),
      name,
      token,
      iconUrl,
    );
  }
}
