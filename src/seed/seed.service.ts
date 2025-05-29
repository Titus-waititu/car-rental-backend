import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { Booking } from 'src/bookings/entities/booking.entity';
import { ContactUsQuery } from 'src/contact_us_queries/entities/contact_us_query.entity';
import { Payment } from 'src/payments/entities/payment.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(GuestUser)
    private readonly guestUserRepo: Repository<GuestUser>,
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
    @InjectRepository(Testimonial)
    private readonly testimonialRepo: Repository<Testimonial>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleBrand)
    private readonly vehicleBrandRepo: Repository<VehicleBrand>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ContactUsQuery)
    private readonly contactUsQueryRepo: Repository<ContactUsQuery>,
  ) {}

  async seed() {
    this.logger.log('Starting database seeding...');

    // Seed Vehicle Brands
    for (let i = 0; i < 5; i++) {
      const brand = this.vehicleBrandRepo.create({
        brand_name: faker.vehicle.manufacturer(),
        created_at: faker.date.past(),
      });
      await this.vehicleBrandRepo.save(brand);
      this.logger.log(`Seeded Vehicle Brand #${i + 1}`);
    }

    // Seed Users
    for (let i = 0; i < 10; i++) {
      const user = this.userRepo.create({
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
      await this.userRepo.save(user);
    }
    this.logger.log('Seeded Users');

    // Seed Admins
    for (let i = 0; i < 5; i++) {
      const admin = this.adminRepo.create({
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        last_login: faker.date.past(),
      });
      await this.adminRepo.save(admin);
    }
    this.logger.log('Seeded Admins');

    // Seed Guest Users
    for (let i = 0; i < 10; i++) {
      const guest = this.guestUserRepo.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
      });
      await this.guestUserRepo.save(guest);
    }
    this.logger.log('Seeded Guest Users');

    // Seed Vehicles
    const allBrands = await this.vehicleBrandRepo.find();
    for (let i = 0; i < 10; i++) {
      const brand = faker.helpers.arrayElement(allBrands);
      const vehicle = this.vehicleRepo.create({
        vehicle_brand: brand,
        model: faker.vehicle.model(),
        color: faker.color.human(),
        price_per_day: faker.number.int({ min: 50, max: 500 }),
        availability: faker.datatype.boolean(),
        created_at: faker.date.past(),
      });
      await this.vehicleRepo.save(vehicle);
    }
    this.logger.log('Seeded Vehicles');

    // Seed Ratings
    const allUsers = await this.userRepo.find();
    const allVehicles = await this.vehicleRepo.find();
    for (let i = 0; i < 20; i++) {
      const rating = this.ratingRepo.create({
        user: faker.helpers.arrayElement(allUsers),
        vehicle: faker.helpers.arrayElement(allVehicles),
        rating_value: faker.number.int({ min: 1, max: 5 }),
        review: faker.lorem.sentence(),
        created_at: faker.date.past(),
      });
      await this.ratingRepo.save(rating);
    }
    this.logger.log('Seeded Ratings');

    // Seed Subscribers
    const allGuests = await this.guestUserRepo.find();
    for (let i = 0; i < 10; i++) {
      const subscriber = this.subscriberRepo.create({
        user: faker.helpers.arrayElement(allUsers),
        guestUser: faker.helpers.arrayElement(allGuests),
        email: faker.helpers.unique(faker.internet.email),
        subscribed_at: faker.date.past(),
      });
      await this.subscriberRepo.save(subscriber);
    }
    this.logger.log('Seeded Subscribers');

    // Seed Testimonials
    for (let i = 0; i < 10; i++) {
      const testimonial = this.testimonialRepo.create({
        user: faker.helpers.arrayElement(allUsers),
        testimonial: faker.lorem.sentence(),
        status: faker.helpers.arrayElement([
          TestimonialStatus.active,
          TestimonialStatus.inactive,
        ]),
        created_at: faker.date.past(),
      });
      await this.testimonialRepo.save(testimonial);
    }
    this.logger.log('Seeded Testimonials');

    this.logger.log('Database seeding completed!');
  }
}
