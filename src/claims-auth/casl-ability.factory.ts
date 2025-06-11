import { Injectable } from '@nestjs/common';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Actions } from './action.enum';
import { User, UserRole } from 'src/users/entities/user.entity';

type Subject =
  | 'Payments'
  | 'all';

export type AppAbility = PureAbility<[Actions, Subject]>;
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

    const { role } = user;

    if (role === UserRole.ADMIN) {
        can(Actions.Manage, 'all');
    }
    return build()
  }
}
