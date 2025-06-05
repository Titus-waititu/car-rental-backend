import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking) private bookingsRepository: Repository<Booking>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
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
      throw new Error(`Booking with ID ${createPaymentDto.bookingId} not found.`);
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
}
