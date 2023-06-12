import { OnlineStatus, Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { UserProgress } from '../../userProgress/entities/userProgress.entity';
import { Otp } from '../../otp/entities/otp.entity';

export class User {
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  middle_name: string | null;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  verified: boolean;
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
  transactions?: Transaction[];
  progress?: UserProgress[];
  otps?: Otp[];

  @ApiProperty({
    enum: OnlineStatus,
    default: OnlineStatus.OFFLINE,
  })
  onlineStatus: OnlineStatus;
}
