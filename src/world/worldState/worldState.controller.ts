import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorldStateService } from './worldState.service';
import { WorldStateDto } from './dto/worldState.dto';

@Controller('worldState')
export class WorldStateController {
  constructor(private readonly worldStateService: WorldStateService) {}

  @Post()
  async create(@Body() updateWorldStateDto: WorldStateDto) {
    await this.worldStateService.create(updateWorldStateDto);
  }

}
