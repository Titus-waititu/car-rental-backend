import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMpesaDto {
  @ApiProperty({
    description: 'The phone number to which the M-Pesa payment is made',
    example: '+254712345678',
  })
  @IsNotEmpty()
  @IsString()
  phoneNum: string;

  @ApiProperty({
    description: 'The amount to be paid via M-Pesa',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The reference for the M-Pesa transaction',
    example: 'MPESA123456',
  })
  @IsNotEmpty()
  @IsString()
  accountRef: string;
}
