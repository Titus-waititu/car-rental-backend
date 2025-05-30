import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { Testimonial, TestimonialStatus } from 'src/testimonials/entities/testimonial.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehicleBrand } from 'src/vehicle_brands/entities/vehicle_brand.entity';
import { Booking, BookingStatus } from 'src/bookings/entities/booking.entity';
import { ContactUsQuery } from 'src/contact_us_queries/entities/contact_us_query.entity';
import { Payment, PaymentMethod, PaymentStatus } from 'src/payments/entities/payment.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
    @InjectRepository(GuestUser) private readonly guestUserRepository: Repository<GuestUser>,
    @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Subscriber) private readonly subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Testimonial) private readonly testimonialRepository: Repository<Testimonial>,
    @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleBrand) private readonly vehicleBrandRepository: Repository<VehicleBrand>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(ContactUsQuery) private readonly contactUsQueryRepository: Repository<ContactUsQuery>,
  ) {}

  async seed() {
    this.logger.log('🌱 Seeding database...');

    // Vehicle Brands
    const vehicleBrands: VehicleBrand[] = [];
    for (let i = 0; i < 5; i++) {
      const brand = this.vehicleBrandRepository.create({
        brand_name: faker.vehicle.manufacturer(),
        created_at: faker.date.past(),
      });
      await this.vehicleBrandRepository.save(brand);
      vehicleBrands.push(brand);
    }

    // Users
    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      const user = this.userRepository.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone_number: faker.phone.number(),
        profile_picture: faker.image.avatar(),
        status: faker.helpers.arrayElement([UserStatus.active, UserStatus.inactive]),
        last_login: faker.date.past(),
      });
      await this.userRepository.save(user);
      users.push(user);
    }

    // Admins
    for (let i = 0; i < 3; i++) {
      const admin = this.adminRepository.create({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        last_login: faker.date.past(),
      });
      await this.adminRepository.save(admin);
    }

    // Guest Users
    const guestUsers: GuestUser[] = [];
    for (let i = 0; i < 10; i++) {
      const guest = this.guestUserRepository.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
      });
      await this.guestUserRepository.save(guest);
      guestUsers.push(guest);
    }

    // Vehicles
    const vehicles: Vehicle[] = [];
    for (let i = 0; i < 10; i++) {
      const vehicle = this.vehicleRepository.create({
        vehicle_brand: faker.helpers.arrayElement(vehicleBrands),
        model: faker.vehicle.model(),
        color: faker.color.human(),
        price_per_day: faker.number.int({ min: 50, max: 500 }),
        availability: true,
        created_at: faker.date.past(),
      });
      await this.vehicleRepository.save(vehicle);
      vehicles.push(vehicle);
    }

 // Bookings
const bookings: Booking[] = [];
for (let i = 0; i < 10; i++) {
  const booking = this.bookingRepository.create({
    user: faker.helpers.arrayElement(users),
    vehicle: faker.helpers.arrayElement(vehicles),
    booking_date: faker.date.past(),
    return_date: faker.date.future(),
    status: faker.helpers.arrayElement([
      BookingStatus.pending,
      BookingStatus.confirmed,
      BookingStatus.cancelled,
    ]),
  });
  const savedBooking = await this.bookingRepository.save(booking);
  bookings.push(savedBooking);
}

// Payments (ensure 1:1)
for (const booking of bookings) {
  const payment = this.paymentRepository.create({
    user: booking.user,
    booking: booking,
    amount: faker.number.int({ min: 100, max: 1000 }),
    payment_method: faker.helpers.arrayElement(Object.values(PaymentMethod)),
    payment_status: faker.helpers.arrayElement(Object.values(PaymentStatus)),
    transactionId: faker.number.int({ min: 100000000, max: 999999999 }),
    payment_date: faker.date.past(),
  });
  await this.paymentRepository.save(payment);
}


    // Ratings
    for (let i = 0; i < 15; i++) {
      const rating = this.ratingRepository.create({
        user: faker.helpers.arrayElement(users),
        vehicle: faker.helpers.arrayElement(vehicles),
        rating_value: faker.number.int({ min: 1, max: 5 }),
        review: faker.lorem.sentence(),
        created_at: faker.date.past(),
      });
      await this.ratingRepository.save(rating);
    }

    // Subscribers
    for (let i = 0; i < 10; i++) {
      const subscriber = this.subscriberRepository.create({
        user: faker.helpers.arrayElement(users),
        guestUser: faker.helpers.arrayElement(guestUsers),
        email: faker.internet.email(),
        subscribed_at: faker.date.past(),
      });
      await this.subscriberRepository.save(subscriber);
    }

    // Testimonials
    for (let i = 0; i < 10; i++) {
      const testimonial = this.testimonialRepository.create({
        user: faker.helpers.arrayElement(users),
        testimonial: faker.lorem.sentences(2),
        status: faker.helpers.arrayElement(Object.values(TestimonialStatus)),
        created_at: faker.date.past(),
      });
      await this.testimonialRepository.save(testimonial);
    }

    this.logger.log('✅ Database seeding complete!');
  }
}
