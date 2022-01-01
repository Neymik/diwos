import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameObjDocument = GameObj & Document;

@Schema()
export class GameObj {
  @Prop()
  x: string;

  @Prop()
  y: string;

  @Prop()
  z: string;
}

export const GameObjSchema = SchemaFactory.createForClass(GameObj);