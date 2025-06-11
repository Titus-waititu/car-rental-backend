import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { CheckPolicies } from 'src/claims-auth/decorators/check-policies.decorator';
import { Actions } from 'src/claims-auth/action.enum';
import { PoliciesGuard } from 'src/claims-auth/guards/policies.guard';
import { CreateMpesaDto } from './dto/create-mpesa.dto';

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

@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(PoliciesGuard)
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  // @Roles(UserRole.ADMIN)
  @CheckPolicies((ability) => ability.can(Actions.Read, 'Payments'))
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }

  @Post('/stkpush')
  async initiateSTKPush(@Body() createMpesaDto: CreateMpesaDto) {
    try {
      const result = await this.paymentsService.stkPush(createMpesaDto);
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
      await this.paymentsService.processCallback(callback);
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
