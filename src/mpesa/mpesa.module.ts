import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/payments/entities/payment.entity';
import { MpesaController } from './mpesa.controller';
import { MpesaService } from './mpesa.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), AuthModule],
  controllers: [MpesaController],
  providers: [MpesaService],
})
export class MpesaModule {}
