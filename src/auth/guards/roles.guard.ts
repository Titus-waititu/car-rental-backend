import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JWTPayload } from '../strategies/at.strategy';
import { User, UserRole } from 'src/users/entities/user.entity';

interface UserRequest extends Request {
  user?: JWTPayload; 
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private profileRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; 
    }
    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    if (!user) {
      return false; 
    }

    const userProfile = await this.profileRepository.findOne({
      where: { user_id: user.sub },
      select: ['user_id', 'role'],
    });

    if (!userProfile) {
      return false; 
    }

    return requiredRoles.some((role) => userProfile.role === role);
  }
}