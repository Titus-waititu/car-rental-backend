import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    const user =
      (await this.userRepository.findOneBy({
        user_id: createBookingDto.userId,
      })) || undefined;
    const vehicle =
      (await this.vehicleRepository.findOneBy({
        vehicle_id: createBookingDto.vehicleId,
      })) || undefined;

    const booking = this.bookingRepository.create({
      booking_date: createBookingDto.booking_date,
      return_date: createBookingDto.return_date,
      status: createBookingDto.status,
      user: user,
      vehicle: vehicle,
    });
    return await this.bookingRepository
      .save(booking)
      .then((savedBooking) => {
        return `Booking created successfully with ID ${savedBooking.booking_id}`;
      })
      .catch((error) => {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
      });
  }

  async findAll(string?: string): Promise<Booking[] | string> {
    if (string) {
      return await this.bookingRepository.find({
        order: {
          booking_id: 'ASC',
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
          booking_id: 'ASC',
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

  async findOne(booking_id: number): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { booking_id },
        relations: ['user', 'vehicle', 'payment'],
      });

      if (!booking) {
        throw new Error(`Booking with ID ${booking_id} not found`);
      }

      return booking;
    } catch (error: unknown) {
      console.error('Error fetching booking:', error);
      throw new Error(`Failed to fetch booking with ID ${booking_id}`);
    }
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<string> {
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

  async remove(id: number): Promise<string> {
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
