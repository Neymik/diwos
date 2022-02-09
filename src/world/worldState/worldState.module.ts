import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorldStateController } from './worldState.controller';
import { WorldStateService } from './worldState.service';
import { WorldState, WorldStateSchema } from './worldState.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: WorldState.name, schema: WorldStateSchema }])],
  controllers: [WorldStateController],
  providers: [WorldStateService],
  exports: [WorldStateService],
})
export class WorldStateModule {}
