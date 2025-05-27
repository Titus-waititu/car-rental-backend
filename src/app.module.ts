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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,
      envFilePath:'.env',

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
