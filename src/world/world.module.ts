import { Module } from '@nestjs/common';
import { WorldController } from './world.controller';
import { WorldService } from './world.service';

import { GameObjModule } from './gameObj/gameObj.module';
import { WorldStateModule } from './worldState/worldState.module';

@Module({
  imports: [GameObjModule, WorldStateModule],
  controllers: [WorldController],
  providers: [WorldService],
})
export class WorldModule {}
