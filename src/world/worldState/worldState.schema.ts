import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WorldStateObjDto } from './dto/worldStateObj.dto';

export type WorldStateDocument = WorldState & Document;

@Schema({ timestamps: true})
export class WorldState {

  @Prop()
  chunkX: string;

  @Prop()
  chunkY: string;

  @Prop()
  data: Array<WorldStateObjDto>;

  @Prop()
  createdAt?: string;

  @Prop()
  updatedAt?: string;

}

export const WorldStateSchema = SchemaFactory.createForClass(WorldState);
