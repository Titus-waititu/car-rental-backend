import { PartialType } from '@nestjs/mapped-types';
import { CreateGuestUserDto } from './create-guest_user.dto';

export class UpdateGuestUserDto extends PartialType(CreateGuestUserDto) {}
