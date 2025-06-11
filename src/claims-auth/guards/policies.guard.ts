import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { PolicyHandler } from '../interfaces/policy-handler.interface';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
    canActivate(context: ExecutionContext): boolean {
        const handlers = this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
        ) || [];
    
        if (!handlers || handlers.length === 0) {
        return true; // No policies to check, allow access
        }
    
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }
        const ability = this.caslAbilityFactory.createForUser(user);
    
        for (const handler of handlers) {
        if (typeof handler === 'function') {
            if (!handler(ability)) {
            throw new ForbiddenException('Access denied by policy handler');
            }
        } else if (handler.handle(ability) === false) {
            throw new ForbiddenException('Access denied by policy handler');
        }
        }
    
        return true; // All policies passed
    }
}