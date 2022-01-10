import { CacheModule, Module } from '@nestjs/common';
import { WorldController } from './world.controller';
import { WorldService } from './world.service';

import { GameObjModule } from './gameObj/gameObj.module';
import { WorldStateModule } from './worldState/worldState.module';
import { WorldGateway } from './world.gateway';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0, // seconds
      max: 10, // maximum number of items in cache
    }), 
    GameObjModule, 
    WorldStateModule
  ],
  controllers: [WorldController],
  providers: [WorldService, WorldGateway],
})

export class WorldModule {}
