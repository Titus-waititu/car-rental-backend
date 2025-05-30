import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';


@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    return await this.bookingRepository
      .save(createBookingDto)
      .then((booking) => {
        return booking;
      });
  }

  async findAll(string?: string):Promise<Booking[] | string> {
    if (string) {
      return await this.bookingRepository.find({
        order: {
          booking_id:'ASC'
        },
        relations: {
          user: true,
          vehicle: true,
          payment: true,
        },
      });
    }
    return await this.bookingRepository
      .find({
         order: {
          booking_id:'ASC'
        },
        relations: {
          user: true,
          vehicle: true,
          payment: true,
        },
      })
      .then((bookings) => {
        if (bookings.length === 0) {
          return 'No bookings found';
        }
        return bookings;
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        throw new Error('Failed to fetch bookings');
      });
  }

  async findOne(booking_id: number):Promise<Booking | string> {
    return await this.bookingRepository
      .findOne({
        where: { booking_id },
        relations: {
          user: true,
          vehicle: true,
          payment: true,
        },
         order: {
          booking_id:'ASC'
        },
      })
      .then((booking) => {
        if (!booking) {
          return `Booking with ID ${booking_id} not found`;
        }
        return booking;
      })
      .catch((error) => {
        console.error('Error fetching booking:', error);
        throw new Error(`Failed to fetch booking with ID ${booking_id}`);
      });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<string> {
    return await this.bookingRepository
      .update(id, updateBookingDto)
      .then((result) => {
        if (result.affected === 0) {
          return `Booking with ID ${id} not found`;
        }
        return `Booking with ID ${id} updated successfully`;
      })
      .catch((error) => {
        console.error('Error updating booking:', error);
        throw new Error(`Failed to update booking with ID ${id}`);
      });
  }

  async remove(id: number):Promise<string> {
    return await this.bookingRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `Booking with ID ${id} not found`;
        }
        return `Booking with ID ${id} deleted successfully`;
      })
      .catch((error) => {
        console.error('Error deleting booking:', error);
        throw new Error(`Failed to delete booking with ID ${id}`);
      });
  }
}
