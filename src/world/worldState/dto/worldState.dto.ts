import { WorldStateObjDto } from './worldStateObj.dto';

export class WorldStateDto {
  readonly chunkX: number;
  readonly chunkY: number;
  readonly data: WorldStateObjDto[];
}
