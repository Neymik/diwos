import { Body, CACHE_MANAGER, Controller, Get, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { WorldService } from './world.service';

@Controller('world')
export class WorldController {
  constructor(
    private readonly worldService: WorldService
    ) {}

}
