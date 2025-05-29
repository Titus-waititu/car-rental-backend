import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const connectionstring =
          configService.getOrThrow<string>('POSTGRES_URL');
        return {
          type: 'postgres',
          url: connectionstring,
          // port: parseInt(configService.getOrThrow<string>('POSTGRESQL_PORT'), 10),
          // username: configService.getOrThrow<string>('POSTGRESQL_USERNAME'),
          // password: configService.getOrThrow<string>('POSTGRESQL_PASSWORD'),
          // database: configService.getOrThrow<string>('POSTGRESQL_DATABASE'),
          autoLoadEntities: true,
          // entities:[User,Admin,Booking,ContactUsQuery,GuestUser,Payment,Rating,Subscriber,Testimonial,VehicleBrand,Vehicle],
          synchronize: configService.getOrThrow<boolean>('DB_SYNC', true),
          logging: configService.getOrThrow<boolean>('DB_LOGGING', false),
          migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
          // ssl: {
          //   rejectUnauthorized: false,
          // },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
