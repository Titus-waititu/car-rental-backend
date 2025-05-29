import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { GuestUser } from 'src/guest_users/entities/guest_user.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import {
  Testimonial,
  TestimonialStatus,
} from 'src/testimonials/entities/testimonial.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehicleBrand } from 'src/vehicle_brands/entities/vehicle_brand.entity';
import { Booking, BookingStatus } from 'src/bookings/entities/booking.entity';
import { ContactUsQuery } from 'src/contact_us_queries/entities/contact_us_query.entity';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from 'src/payments/entities/payment.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(GuestUser)
    private readonly guestUserRepository: Repository<GuestUser>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleBrand)
    private readonly vehicleBrandRepository: Repository<VehicleBrand>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(ContactUsQuery)
    private readonly contactUsQueryRepository: Repository<ContactUsQuery>,
  ) {}

  async seed() {
    this.logger.log('Seeding database...');

    // Clear existing data
    // await this.userRepository.clear();
    // await this.adminRepository.clear();
    // await this.guestUserRepository.clear();
    // await this.ratingRepository.clear();
    // await this.subscriberRepository.clear();
    // await this.testimonialRepository.clear();
    // await this.vehicleRepository.clear();
    // await this.vehicleBrandRepository.clear();
    // await this.paymentRepository.clear();
    // await this.bookingRepository.clear();
    // await this.contactUsQueryRepository.clear();
    this.logger.log('Existing data cleared.');

    // Seed Vehicle Brands
    for (let i = 0; i < 5; i++) {
      const vehicleBrand = this.vehicleBrandRepository.create({
        brand_name: faker.vehicle.manufacturer(),
        created_at: faker.date.past(),
      });
      await this.vehicleBrandRepository.save(vehicleBrand);
      this.logger.log(`Vehicle Brand ${i + 1} seeded successfully.`);
    }
    // Seed Users
    for (let i = 0; i < 10; i++) {
      const user = this.userRepository.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone_number: faker.phone.number(),
        profile_picture: faker.image.avatar(),
        status: faker.helpers.arrayElement([
          UserStatus.active,
          UserStatus.inactive,
        ]),
        last_login: faker.date.past(),
      });
      await this.userRepository.save(user);
    }
    this.logger.log('Users seeded successfully.');

    // Seed Admins
    for (let i = 0; i < 5; i++) {
      const admin = this.adminRepository.create({
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        last_login: faker.date.past(),
      });
      await this.adminRepository.save(admin);
    }
    this.logger.log('Admins seeded successfully.');

    // Seed Guest Users
    for (let i = 0; i < 10; i++) {
      const guestUser = this.guestUserRepository.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
      });
      await this.guestUserRepository.save(guestUser);
      this.logger.log('Database seeding completed successfully.');
    }

    //seed vehicles
    const allVehicleBrands = await this.vehicleBrandRepository.find({
      order: { brand_id: 'ASC' },
    });
    for (let i = 0; i < 10; i++) {
      const randomIndex = faker.number.int({
        min: 0,
        max: allVehicleBrands.length - 1,
      });
      const vehicleBrand = allVehicleBrands[randomIndex];

      const vehicle = this.vehicleRepository.create({
        vehicle_brand: vehicleBrand,
        model: faker.vehicle.model(),
        color: faker.color.human(),
        price_per_day: faker.number.int({ min: 50, max: 500 }),
        availability: faker.datatype.boolean(),
        created_at: faker.date.past(),
      });
      await this.vehicleRepository.save(vehicle);
      this.logger.log(`Vehicle ${i + 1} seeded successfully.`);
    }

    // Seed Ratings

    const allUsers = await this.userRepository.find();
    const allVehicles = await this.vehicleRepository.find();
    for (let i = 0; i < 20; i++) {
      const randomUserIndex = faker.number.int({
        min: 0,
        max: allUsers.length - 1,
      });
      const randomVehicleIndex = faker.number.int({
        min: 0,
        max: allVehicles.length - 1,
      });

      const rating = this.ratingRepository.create({
        user: allUsers[randomUserIndex],
        vehicle: allVehicles[randomVehicleIndex],
        rating_value: faker.number.int({ min: 1, max: 5 }),
        review: faker.lorem.sentence(),
        created_at: faker.date.past(),
      });
      await this.ratingRepository.save(rating);
      this.logger.log(`Rating ${i + 1} seeded successfully.`);
    }

    // Seed Subscribers
    const allGuestUsers = await this.guestUserRepository.find();
    for (let i = 0; i < 10; i++) {
      const randomGuestUserIndex = faker.number.int({
        min: 0,
        max: allGuestUsers.length - 1,
      });
      const randomUserIndex = faker.number.int({
        min: 0,
        max: allUsers.length - 1,
      });
      const subscriber = this.subscriberRepository.create({
        user: allUsers[randomUserIndex],
        guestUser: allGuestUsers[randomGuestUserIndex],
        email: faker.internet.email(),
        subscribed_at: faker.date.past(),
      });
      await this.subscriberRepository.save(subscriber);
      this.logger.log(`Subscriber ${i + 1} seeded successfully.`);
    }

    // Seed Testimonials
    for (let i = 0; i < 10; i++) {
      const randomUserIndex = faker.number.int({
        min: 0,
        max: allUsers.length - 1,
      });
      const testimonial = this.testimonialRepository.create({
        user: allUsers[randomUserIndex],
        testimonial: faker.lorem.sentence(),
        status: faker.helpers.arrayElement([
          TestimonialStatus.active,
          TestimonialStatus.inactive,
        ]),
        created_at: faker.date.past(),
      });
      await this.testimonialRepository.save(testimonial);
      this.logger.log(`Testimonial ${i + 1} seeded successfully.`);
    }

    // Seed Payments
    for (let i = 0; i < 10; i++) {
      const randomUser = faker.helpers.arrayElement(allUsers);
      const randomBooking = await this.bookingRepository.findOneBy({
        booking_id: i + 1, // Assuming you have 10 bookings with sequential IDs
      });

      if (!randomBooking) {
        this.logger.warn(
          `Booking with ID ${i + 1} not found. Skipping payment.`,
        );
        continue;
      }

      const payment = this.paymentRepository.create({
        user: randomUser,
        booking: randomBooking,
        amount: faker.number.int({ min: 100, max: 1000 }),
        payment_method: faker.helpers.arrayElement([
          PaymentMethod.CreditCard,
          PaymentMethod.PayPal,
          PaymentMethod.BankTransfer,
          PaymentMethod.Cash,
          PaymentMethod.MPesa,
        ]),
        transactionId: faker.number.int({ min: 100000000, max: 999999999 }),
        payment_status: faker.helpers.arrayElement([
          PaymentStatus.Pending,
          PaymentStatus.Completed,
          PaymentStatus.Failed,
        ]),
        payment_date: faker.date.past(),
      });

      await this.paymentRepository.save(payment);
      this.logger.log(`Payment ${i + 1} seeded successfully.`);
    }

   // Seed Bookings
for (let i = 0; i < 10; i++) {
  const randomUser = faker.helpers.arrayElement(allUsers);
  const randomVehicle = faker.helpers.arrayElement(allVehicles);

  const bookingStartDate = faker.date.past();
  const bookingEndDate = faker.date.future({ years: 1 });

  const booking = this.bookingRepository.create({
    user: randomUser,
    vehicle: randomVehicle,
    booking_date: bookingStartDate,
    return_date: bookingEndDate,
    status: faker.helpers.arrayElement([
      BookingStatus.pending,
      BookingStatus.confirmed,
      BookingStatus.cancelled,
    ]),
  });

  await this.bookingRepository.save(booking);
  this.logger.log(`Booking ${i + 1} seeded successfully.`);
}

  }
}
