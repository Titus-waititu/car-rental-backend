import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GuestUsersService } from './guest_users.service';
import { CreateGuestUserDto } from './dto/create-guest_user.dto';
import { UpdateGuestUserDto } from './dto/update-guest_user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('guest users')
@Controller('guest-users')
export class GuestUsersController {
  constructor(private readonly guestUsersService: GuestUsersService) {}

  @Post()
    @Roles(UserRole.ADMIN, UserRole.USER)
  create(@Body() createGuestUserDto: CreateGuestUserDto) {
    return this.guestUsersService.create(createGuestUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.guestUsersService.findAll();
  }

  @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.guestUsersService.findOne(id);
  }

  @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuestUserDto: UpdateGuestUserDto,
  ) {
    return this.guestUsersService.update(id, updateGuestUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.guestUsersService.remove(id);
  }
}
