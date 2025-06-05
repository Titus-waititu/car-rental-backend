import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  first_name: string;

  @IsString()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  last_name: string;

  @IsEnum(UserStatus)
  @ApiProperty({
    description: 'The status of the user',
    enum: UserStatus,
    default: UserStatus.active,
    required: false,
  })
  @IsOptional()
  status?: UserStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: false,
  })
  phone_number?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The profile picture URL of the user',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profile_picture?: string;

  @IsDateString()
  @ApiProperty({
    description: 'The last login date of the user',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  last_login?: Date;
}
