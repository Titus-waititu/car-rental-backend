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
import { ContactUsQueriesService } from './contact_us_queries.service';
import { CreateContactUsQueryDto } from './dto/create-contact_us_query.dto';
import { UpdateContactUsQueryDto } from './dto/update-contact_us_query.dto';

@Controller('contact-us-queries')
export class ContactUsQueriesController {
  constructor(
    private readonly contactUsQueriesService: ContactUsQueriesService,
  ) {}

  @Post()
  create(@Body() createContactUsQueryDto: CreateContactUsQueryDto) {
    return this.contactUsQueriesService.create(createContactUsQueryDto);
  }

  @Get()
  findAll() {
    return this.contactUsQueriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactUsQueriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactUsQueryDto: UpdateContactUsQueryDto,
  ) {
    return this.contactUsQueriesService.update(id, updateContactUsQueryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactUsQueriesService.remove(id);
  }
}
