import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: Role,
  })
  role: Role | null;

  @ApiProperty({
    type: `string`,
    format: `date-time`,
  })
  createdAt: Date;

  @ApiProperty({
    type: `string`,
    format: `date-time`,
  })
  updatedAt: Date;
}
