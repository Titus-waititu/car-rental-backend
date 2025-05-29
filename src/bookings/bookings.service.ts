import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository:Repository<Booking>
  ){}
  async create(createBookingDto: CreateBookingDto) {
    return await this.bookingRepository.save(createBookingDto).then((booking)=>{
      return booking;
    })
  }

  findAll() {
    return this.bookingRepository.find().then((bookings)=>{
      if (bookings.length === 0) {
        return 'No bookings found';
      }
      return bookings;
    }
    ).catch((error)=>{
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
