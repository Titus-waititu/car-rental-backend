import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGuestUserDto {
  @ApiProperty({
    description: 'The email of the guest user',
    example: 'example@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The first name of the guest user',
    example: 'John',
  })
  @IsString()
  first_name: string;

  @IsString()
  @ApiProperty({
    description: 'The last name of the guest user',
    example: 'Doe',
  })
  last_name: string;

  @IsString()
  @ApiProperty({
    description: 'The phone number of the guest user',
    example: '+1234567890',
  })
  phone_number: string;
}
