import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy } from './strategies/at.strategy';
import { RfStrategy } from './strategies/tr.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
    }), // Register JwtModule with global configuration
    PassportModule, // Register PassportModule for strategies
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RfStrategy, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
