import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorldStateDocument = WorldState & Document;

@Schema()
export class WorldState {

  @Prop()
  chunkX: string;

  @Prop()
  chunkY: string;

  @Prop()
  data: string;

}

export const WorldStateSchema = SchemaFactory.createForClass(WorldState);
