
import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);
    if (!createdUser) {
      return 406;
    }
  }

  @Get('/:username')
  async findOne(@Param('username') username: string): Promise<User> {
    return this.userService.findOne(username);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  

}
