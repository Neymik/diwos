import { ApiProperty } from '@nestjs/swagger';

export class PostLogin {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: number;
}
