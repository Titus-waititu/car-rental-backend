import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { CreateMpesaDto } from './dto/create-mpesa.dto';
import { Public } from 'src/auth/decorators/public.decorator';

interface STKCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

@Public()
@Controller('mpesa')
export class MpesaController {
  private readonly logger = new Logger(MpesaController.name);

  constructor(private readonly mpesaService: MpesaService) {}

  @Post('/stkpush')
  async initiateSTKPush(@Body() createMpesaDto: CreateMpesaDto) {
    try {
      const result = await this.mpesaService.stkPush(createMpesaDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`STK Push failed: ${error.message}`);
      throw new HttpException(
        'Failed to initiate payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/callback')
  async handleSTKCallback(@Body() callback: STKCallback) {
    try {
      await this.mpesaService.processCallback(callback);
      return { success: true, message: 'Callback processed' };
    } catch (error) {
      this.logger.error(`Callback handling failed: ${error.message}`);
      throw new HttpException(
        'Failed to process callback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
