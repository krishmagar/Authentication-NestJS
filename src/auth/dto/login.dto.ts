import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
