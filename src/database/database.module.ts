import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.getOrThrow<string>('DB_URL');
        return {
          type: 'postgres',
          url: connectionString,
          // host: configService.getOrThrow<string>('DB_HOST'),
          // port: configService.getOrThrow<number>('DB_PORT'),
          // username: configService.getOrThrow<string>('DB_USERNAME'),
          // password: configService.getOrThrow<string>('DB_PASSWORD'),
          // database: configService.getOrThrow<string>('DB_NAME'),
          // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: configService.getOrThrow<boolean>('DB_SYNC', true),
          logging: configService.getOrThrow<boolean>('DB_LOGGING', false),
          ssl: {
            rejectUnauthorized: false, // Important for Neon
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
