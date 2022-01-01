import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameObjService } from './gameObj.service';

@Controller('gameObj')
export class GameObjController {
  constructor(private readonly userService: GameObjService) {}

}
