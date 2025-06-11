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
import { ContactUsQueriesService } from './contact_us_queries.service';
import { CreateContactUsQueryDto } from './dto/create-contact_us_query.dto';
import { UpdateContactUsQueryDto } from './dto/update-contact_us_query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('contact us')
@Controller('contact-us-queries')
export class ContactUsQueriesController {
  constructor(
    private readonly contactUsQueriesService: ContactUsQueriesService,
  ) {}

  @Post()
    @Roles(UserRole.ADMIN, UserRole.USER)
  create(@Body() createContactUsQueryDto: CreateContactUsQueryDto) {
    return this.contactUsQueriesService.create(createContactUsQueryDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.contactUsQueriesService.findAll();
  }

  @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactUsQueriesService.findOne(id);
  }

  @Patch(':id')
    @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactUsQueryDto: UpdateContactUsQueryDto,
  ) {
    return this.contactUsQueriesService.update(id, updateContactUsQueryDto);
  }

  @Delete(':id')
    @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactUsQueriesService.remove(id);
  }
}
