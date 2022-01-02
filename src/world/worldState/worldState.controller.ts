import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorldStateService } from './worldState.service';
import { CreateWorldStateDto } from './dto/create-worldState.dto';

@Controller('worldState')
export class WorldStateController {
  constructor(private readonly worldStateService: WorldStateService) {}

  @Post()
  async create(@Body() updateWorldStateDto: CreateWorldStateDto) {
    await this.worldStateService.create(updateWorldStateDto);
  }

}
