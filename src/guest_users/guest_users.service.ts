import { Injectable } from '@nestjs/common';
import { CreateGuestUserDto } from './dto/create-guest_user.dto';
import { UpdateGuestUserDto } from './dto/update-guest_user.dto';

@Injectable()
export class GuestUsersService {
  create(createGuestUserDto: CreateGuestUserDto) {
    return 'This action adds a new guestUser';
  }

  findAll() {
    return `This action returns all guestUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guestUser`;
  }

  update(id: number, updateGuestUserDto: UpdateGuestUserDto) {
    return `This action updates a #${id} guestUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} guestUser`;
  }
}
