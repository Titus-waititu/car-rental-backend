import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';


export class CreateAdminDto {
@ApiProperty({
  description: 'The username of the admin',
  example: 'admin123',
  
})
  @IsString()
  username: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the admin',
    example: 'securePassword123',
  })
  password: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the admin',
    example: 'example@gmail.com',
    required: false
  })
  @IsOptional()
  email: string;

  @IsDateString()
  @ApiProperty({
    description: 'The last login date of the admin',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  last_login?: Date;
}
