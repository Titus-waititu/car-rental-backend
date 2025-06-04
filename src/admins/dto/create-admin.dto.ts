import { IsDateString, IsEmail, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsDateString()
  last_login: Date;
}
