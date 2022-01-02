import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorldService } from './world.service';

@Controller('world')
export class WorldController {
  constructor(private readonly worldService: WorldService) {}

}
