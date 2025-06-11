import {
  Injectable,
  Inject,
  HttpException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CreateMpesaDto } from './dto/create-mpesa.dto';
import { Payment, PaymentStatus } from 'src/payments/entities/payment.entity';
import axios, { AxiosError } from 'axios';

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
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private readonly mpesaConfig: MpesaConfig;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.mpesaConfig = {
      shortcode: '174379',
      passkey: this.configService.get<string>('PASS_KEY') ?? (() => { throw new Error('PASS_KEY is not set'); })(),
      callbackUrl: this.configService.get<string>('MPESA_CALLBACK_URL') ?? (() => { throw new Error('MPESA_CALLBACK_URL is not set'); })(),
      transactionType: 'CustomerPayBillOnline',
    };
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
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

      const cachedTransaction = await this.getCachedTransaction(CheckoutRequestID);
      if (!cachedTransaction) {
        throw new HttpException('Transaction not found in cache', 404);
      }

      const metadata = this.extractCallbackMetadata(CallbackMetadata?.Item || []);

      const transaction = this.paymentRepository.create({
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        amount: cachedTransaction.Amount,
        mpesaReceiptNumber: metadata.MpesaReceiptNumber || '',
        balance: metadata.Balance || 0,
        transactionDate: new Date(metadata.TransactionDate || Date.now()),
        phoneNumber: cachedTransaction.PhoneNumber,
        status: ResultCode === '0' ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
      });

      await this.paymentRepository.save(transaction);
      await this.cacheManager.del(CheckoutRequestID);
    } catch (error) {
      this.logger.error(`Callback processing failed: ${error.message}`);
      throw new HttpException('Failed to process callback', 500);
    }
  }

  private async cacheInitialTransaction(transactionData: TransactionCache): Promise<void> {
    try {
      await this.cacheManager.set(
        transactionData.CheckoutRequestID,
        transactionData,
        3600,
      );
    } catch (error) {
      this.logger.error(`Error caching transaction: ${error}`);
      throw new HttpException('Failed to cache transaction', 500);
    }
  }

  private async getCachedTransaction(checkoutRequestId: string): Promise<TransactionCache | null> {
    const cached = await this.cacheManager.get<TransactionCache>(checkoutRequestId);
    return cached ?? null;
  }

  private extractCallbackMetadata(items: any[]): Record<string, any> {
    return items.reduce((acc, item) => ({ ...acc, [item.Name]: item.Value }), {});
  }

  private validateDto(dto: CreateMpesaDto): void {
    if (!/^2547\d{8}$/.test(dto.phoneNum)) {
      throw new HttpException('Phone number must be in the format 2547XXXXXXXX', 400);
    }
    if (!/^[a-zA-Z0-9]{1,12}$/.test(dto.accountRef)) {
      throw new HttpException('Account reference must be alphanumeric and ≤ 12 characters', 400);
    }
    if (dto.amount <= 0) {
      throw new HttpException('Amount must be greater than 0', 400);
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

  async generateToken(): Promise<string> {
    const consumerKey = this.configService.get<string>('CONSUMER_KEY');
    const consumerSecret = this.configService.get<string>('CONSUMER_SECRET');

    if (!consumerKey || !consumerSecret) {
      throw new HttpException(
        'M-Pesa consumer key and/or secret not set in config',
        500,
      );
    }

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
      const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });
console.log(response.data.access_token)
      return response.data.access_token;
    } catch (error) {
      this.logger.error(`Failed to generate M-Pesa token: ${error.message}`);
      throw new HttpException('Failed to generate M-Pesa token', 500);
    }
  }

  private async getAuthToken(): Promise<string> {
    const token = await this.generateToken();
    if (!token) {
      throw new HttpException('Failed to generate token', 401);
    }
    return token;
  }

  private createSTKPushRequest(dto: CreateMpesaDto, timestamp: string, password: string): STKPushRequest {
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

  private async sendSTKPushRequest(requestBody: STKPushRequest, token: string) {
    return axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) throw error;

    if (error instanceof AxiosError) {
      this.logger.error(`API Error: ${error.message}`, error.response?.data);
      throw new HttpException(`Failed to process payment: ${error.message}`, error.response?.status || 500);
    }

    this.logger.error(`Unexpected error: ${error}`);
    throw new HttpException('Internal server error', 500);
  }
}
