import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { GuestUsersModule } from './guest_users/guest_users.module';
import { VehicleBrandsModule } from './vehicle_brands/vehicle_brands.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { BookingsModule } from './bookings/bookings.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ContactUsQueriesModule } from './contact_us_queries/contact_us_queries.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './logger.middleware';
import { DatabaseModule } from './database/database.module';
import { PaymentsModule } from './payments/payments.module';
import { RatingsModule } from './ratings/ratings.module';
import { SeedModule } from './seed/seed.module';
import { LogsModule } from './logger/logs.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { createKeyv, Keyv } from '@keyv/redis';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard } from './auth/guards/at.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ClaimsAuthModule } from './claims-auth/claims-auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    UsersModule,
    GuestUsersModule,
    VehicleBrandsModule,
    VehiclesModule,
    BookingsModule,
    TestimonialsModule,
    ContactUsQueriesModule,
    SubscribersModule,
    DatabaseModule,
    PaymentsModule,
    RatingsModule,
    SeedModule,
    LogsModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 60000, // Default TTL for cache entries
          stores: [
            // Memory store for fast local access
            new Keyv({
              store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
            }),
            // Redis store for distributed caching
            createKeyv(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),
    AuthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('THROTTLE_TTL', {
            infer: true,
          }),
          limit: configService.getOrThrow<number>('THROTTLE_LIMIT', {
            infer: true,
          }),
          ignoreUserAgents: [/^curl\//, /^PostmanRuntime\//],
        },
      ],
    }),
    ClaimsAuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard, // Global guard to protect routes
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
