import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createCatDto: CreateUserDto): Promise<User> {
    const createdCat = await this.userModel.create(createCatDto);
    return createdCat;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}

