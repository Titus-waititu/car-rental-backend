import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
// import { Admin } from 'src/admins/entities/admin.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { ContactUsQuery } from 'src/contact_us_queries/entities/contact_us_query.entity';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { Testimonial } from 'src/testimonials/entities/testimonial.entity';
import { User } from 'src/users/entities/user.entity';
import { VehicleBrand } from 'src/vehicle_brands/entities/vehicle_brand.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Admin,
      Booking,
      ContactUsQuery,
      GuestUser,
      Payment,
      Rating,
      Subscriber,
      Testimonial,
      User,
      VehicleBrand,
      Vehicle,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
