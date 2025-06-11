import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod, PaymentStatus } from 'src/payments/entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the user making the payment',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'The ID of the booking associated with the payment',
    example: 123,
  })
  @IsNumber()
  bookingId: number;

  @ApiProperty({
    description: 'The method of payment used',
    enum: PaymentMethod,
    example: PaymentMethod.MPesa,
  })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({
    description: 'The amount paid in the transaction',
    example: 150.0,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'Phone number used for payment (MPesa)',
    example: '254712345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'MPesa Receipt Number if applicable',
    example: 'QWE1234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  mpesaReceiptNumber?: string;

  @ApiProperty({
    description: 'Date and time when the payment was made',
    example: '2024-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  transactionDate?: Date;
}
