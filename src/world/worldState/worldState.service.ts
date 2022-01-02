import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWorldStateDto } from './dto/create-worldState.dto';
import { WorldState, WorldStateDocument } from './worldState.schema';

@Injectable()
export class WorldStateService {
  constructor(
    @InjectModel(WorldState.name) private readonly worldStateModel: Model<WorldStateDocument>,
  ) {}

  async create(createUserDto: CreateWorldStateDto): Promise<WorldState> {
    const createdWorldState = await this.worldStateModel.create(createUserDto);
    return createdWorldState;
  }

  async findAll(): Promise<WorldState[]> {
    return this.worldStateModel.find().exec();
  }
}