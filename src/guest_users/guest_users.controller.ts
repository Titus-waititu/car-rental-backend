import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { CreateGuestUserDto } from './dto/create-guest_user.dto';
import { UpdateGuestUserDto } from './dto/update-guest_user.dto';

@Controller('guest-users')
export class GuestUsersController {
  constructor(private readonly guestUsersService: GuestUsersService) {}

  @Post()
  create(@Body() createGuestUserDto: CreateGuestUserDto) {
    return this.guestUsersService.create(createGuestUserDto);
  }

  @Get()
  findAll() {
    return this.guestUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.guestUsersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id',ParseIntPipe) id: number,
    @Body() updateGuestUserDto: UpdateGuestUserDto,
  ) {
    return this.guestUsersService.update(id, updateGuestUserDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.guestUsersService.remove(id);
  }
}
