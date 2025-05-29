import {
  IsDateString,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  phone_number: string;

  @IsString()
  profile_picture: string;

  @IsDateString()
  last_login: Date;
}
