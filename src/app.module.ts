import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { GuestUsersModule } from './guest_users/guest_users.module';
import { VehicleBrandsModule } from './vehicle_brands/vehicle_brands.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { BookingsModule } from './bookings/bookings.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ContactUsQueriesModule } from './contact_us_queries/contact_us_queries.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ConfigModule  } from '@nestjs/config';
import { LoggerMiddleware } from './logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Vehicle } from './vehicles/entities/vehicle.entity';
import { VehicleBrand } from './vehicle_brands/entities/vehicle_brand.entity';
import { Booking } from './bookings/entities/booking.entity';
import { Admin } from './admins/entities/admin.entity';
import { ContactUsQuery } from './contact_us_queries/entities/contact_us_query.entity';
import { GuestUser } from './guest_users/entities/guest_user.entity';
import { Subscriber } from './subscribers/entities/subscriber.entity';
import { Testimonial } from './testimonials/entities/testimonial.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,
      envFilePath:'.env',

     }),
     TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password: process.env.PASSWORD || '1234',
      database:'car-rental',
      entities:[User,Vehicle,VehicleBrand,Booking,Admin,ContactUsQuery
      ,GuestUser,Subscriber,Testimonial],
      synchronize:true,
      autoLoadEntities:true
      
     }),
    AdminsModule,
    UsersModule,
    GuestUsersModule,
    VehicleBrandsModule,
    VehiclesModule,
    BookingsModule,
    TestimonialsModule,
    ContactUsQueriesModule,
    SubscribersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
