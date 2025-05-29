import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('POSTGRES_URL'),
        port: parseInt(configService.getOrThrow<string>('POSTGRESQL_PORT'), 10),
        username: configService.getOrThrow<string>('POSTGRESQL_USERNAME'),
        password: configService.getOrThrow<string>('POSTGRESQL_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRESQL_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // entities:[User,Admin,Booking,ContactUsQuery,GuestUser,Payment,Rating,Subscriber,Testimonial,VehicleBrand,Vehicle],
        synchronize: configService.getOrThrow<boolean>('DB_SYNC', true),
        logging: configService.getOrThrow<boolean>('DB_LOGGING', false),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
