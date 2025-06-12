import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'strongpassword123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
