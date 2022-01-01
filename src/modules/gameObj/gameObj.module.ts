import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameObjController } from './gameObj.controller';
import { GameObjService } from './gameObj.service';
import { GameObj, GameObjSchema } from './gameObj.schema';

@Module({
  //imports: [MongooseModule.forFeature([{ name: GameObj.id, schema: GameObjSchema }])],
  controllers: [GameObjController],
  providers: [GameObjService],
})
export class GameObjModule {}
