import { IsString } from 'class-validator';

export class CreateGuestUserDto {
  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone_number: string;
}
