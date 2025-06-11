import { Injectable, HttpException, Logger, Inject } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CreateMpesaDto } from './dto/create-mpesa.dto';
import axios from 'axios';
import { PaymentStatus } from './entities/payment.entity';

interface MpesaConfig {
  shortcode: string;
  passkey: string;
  callbackUrl: string;
  transactionType: string;
}

interface STKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

interface TransactionCache {
  CheckoutRequestID: string;
  MerchantRequestID: string;
  Amount: number;
  PhoneNumber: string;
  status: PaymentStatus;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly mpesaConfig: MpesaConfig;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @InjectRepository(Payment) private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking) private bookingsRepository: Repository<Booking>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.mpesaConfig = {
      shortcode: '174379',
      passkey:
        this.configService.get<string>('PASS_KEY') ??
        (() => {
          throw new Error('PASS_KEY is not set');
        })(),
      callbackUrl:
        this.configService.get<string>('MPESA_CALLBACK_URL') ??
        (() => {
          throw new Error('MPESA_CALLBACK_URL is not set');
        })(),
      transactionType: 'CustomerPayBillOnline',
    };
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const user = await this.userRepository.findOne({
      where: { user_id: createPaymentDto.userId },
    });
    if (!user) {
      throw new Error(`User with ID ${createPaymentDto.userId} not found.`);
    }

    const booking = await this.bookingsRepository.findOne({
      where: { booking_id: createPaymentDto.bookingId },
    });
    if (!booking) {
      throw new Error(
        `Booking with ID ${createPaymentDto.bookingId} not found.`,
      );
    }
    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      user: user,
      booking: booking,
    });
    return this.paymentsRepository
      .save(payment)
      .then((savedPayment) => {
        return `Payment with ID ${savedPayment.payment_id} created successfully.`;
      })
      .catch((error) => {
        console.error('Error creating payment:', error);
        throw new Error('Failed to create payment.');
      });
  }

  async findAll(): Promise<Payment[] | string> {
    return this.paymentsRepository
      .find({
        order: {
          payment_id: 'ASC', // Sort by payment_id in ascending order
        },
        relations: {
          booking: true,
          user: true,
        },
      })
      .then((payments) => {
        if (payments.length === 0) {
          return 'No payments found.';
        }
        return payments;
      })
      .catch((error) => {
        console.error('Error retrieving payments:', error);
        throw new Error('Failed to retrieve payments.');
      });
  }

  async findOne(payment_id: number): Promise<Payment | string> {
    return this.paymentsRepository
      .findOne({
        where: { payment_id },
        relations: {
          booking: true,
          user: true,
        },
        order: {
          payment_id: 'ASC',
        },
      })
      .then((payment) => {
        if (!payment) {
          return `Payment with ID ${payment_id} not found.`;
        }
        return payment;
      })
      .catch((error) => {
        console.error('Error retrieving payment:', error);
        throw new Error(`Failed to retrieve payment with ID ${payment_id}.`);
      });
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<string> {
    return this.paymentsRepository
      .update(id, updatePaymentDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Payment with ID ${id} not found or no changes made.`;
        }
        return `Payment with ID ${id} updated successfully.`;
      })
      .catch((error) => {
        console.error('Error updating payment:', error);
        throw new Error(`Failed to update payment with ID ${id}.`);
      });
  }

  async remove(id: number): Promise<string> {
    return this.paymentsRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Payment with ID ${id} not found.`;
        }
        return `Payment with ID ${id} deleted successfully.`;
      })
      .catch((error) => {
        console.error('Error deleting payment:', error);
        throw new Error(`Failed to delete payment with ID ${id}.`);
      });
  }

  async stkPush(dto: CreateMpesaDto): Promise<any> {
    try {
      this.validateDto(dto);
      const token = await this.getAuthToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const requestBody = this.createSTKPushRequest(dto, timestamp, password);
      const response = await this.sendSTKPushRequest(requestBody, token);

      await this.cacheInitialTransaction({
        CheckoutRequestID: response.data.CheckoutRequestID,
        MerchantRequestID: response.data.MerchantRequestID,
        Amount: dto.amount,
        PhoneNumber: dto.phoneNum,
        status: PaymentStatus.PENDING,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async processCallback(callbackData: any): Promise<void> {
    try {
      const {
        Body: { stkCallback },
      } = callbackData;
      const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
        CallbackMetadata,
      } = stkCallback;

      const cachedTransaction =
        await this.getCachedTransaction(CheckoutRequestID);
      if (!cachedTransaction) {
        throw new HttpException('Transaction not found in cache', 404);
      }

      // Extract metadata from callback
      const metadata = this.extractCallbackMetadata(
        CallbackMetadata?.Item || [],
      );

      // Create and save payment record
      const payment = this.paymentsRepository.create({
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        amount: cachedTransaction.Amount,
        mpesaReceiptNumber: metadata.MpesaReceiptNumber || '',
        balance: metadata.Balance || 0,
        transactionDate: new Date(metadata.TransactionDate || Date.now()),
        phoneNumber: cachedTransaction.PhoneNumber,
        status:
          ResultCode === 0 ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
      });
      await this.paymentsRepository.save(payment);
      await this.cacheManager.del(CheckoutRequestID);
    } catch (error) {
      this.handleError(error);
    }
  }

  private extractCallbackMetadata(items: any[]): Record<string, any> {
    return items.reduce(
      (acc, item) => ({ ...acc, [item.Name]: item.Value }),
      {},
    );
  }

  private async cacheInitialTransaction(
    transaction: TransactionCache,
  ): Promise<void> {
    try {
      await this.cacheManager.set(
        transaction.CheckoutRequestID,
        transaction,
        3600,
      );
    } catch (error) {
      this.logger.error(`Error caching transaction: ${error}`);
      throw new HttpException('Failed to cache transaction', 500);
    }
  }

  private async sendSTKPushRequest(
    requestBody: STKPushRequest,
    token: string,
  ): Promise<any> {
    return axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  private validateDto(dto: CreateMpesaDto): void {
    if (!/^2547\d{8}$/.test(dto.phoneNum)) {
      throw new HttpException(
        'Phone number must be in the format 2547XXXXXXXX',
        400,
      );
    }
    if (!/^[a-zA-Z0-9]{1,12}$/.test(dto.accountRef)) {
      throw new HttpException(
        'Account reference must be alphanumeric and ≤ 12 characters',
        400,
      );
    }
    if (dto.amount <= 0) {
      throw new HttpException('Amount must be greater than 0', 400);
    }
  }

  private async getAuthToken(): Promise<string> {
    const token = await this.generateToken();
    if (!token) {
      throw new HttpException('Failed to generate token', 401);
    }
    return token;
  }

  async generateToken(): Promise<string> {
    const consumerKey = this.configService.get<string>('CONSUMER_KEY');
    const consumerSecret = this.configService.get<string>('CONSUMER_SECRET');

    if (!consumerKey || !consumerSecret) {
      throw new HttpException(
        'M-Pesa consumer key and/or secret not set in config',
        500,
      );
    }

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
    ).toString('base64');

    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.error(`Failed to generate M-Pesa token: ${error.message}`);
      throw new HttpException('Failed to generate M-Pesa token', 500);
    }
  }

  private generateTimestamp(): string {
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }

  private generatePassword(timestamp: string): string {
    const { shortcode, passkey } = this.mpesaConfig;
    return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  }

  private createSTKPushRequest(
    dto: CreateMpesaDto,
    timestamp: string,
    password: string,
  ): STKPushRequest {
    const { shortcode, transactionType, callbackUrl } = this.mpesaConfig;
    return {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: dto.amount,
      PartyA: dto.phoneNum,
      PartyB: shortcode,
      PhoneNumber: dto.phoneNum,
      CallBackURL: callbackUrl,
      AccountReference: dto.accountRef,
      TransactionDesc: 'szken',
    };
  }

  private async getCachedTransaction(
    checkoutRequestId: string,
  ): Promise<TransactionCache | null> {
    const cached =
      await this.cacheManager.get<TransactionCache>(checkoutRequestId);
    return cached ?? null;
  }

  private handleError(error: any): never {
    if (error instanceof HttpException) throw error;
    if (axios.isAxiosError(error)) {
      this.logger.error(`API Error: ${error.message}`, error.response?.data);
      throw new HttpException(
        `Failed to process payment: ${error.message}`,
        error.response?.status || 500,
      );
    }
    this.logger.error(`Unexpected error: ${error}`);
    throw new HttpException('Internal server error', 500);
  }
}
