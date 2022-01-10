
import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }

  @Get('/:login')
  async findOne(@Param('login') login: string): Promise<User> {
    return this.userService.findOne(login);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  

}
