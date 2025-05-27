import { Injectable } from '@nestjs/common';
import { CreateContactUsQueryDto } from './dto/create-contact_us_query.dto';
import { UpdateContactUsQueryDto } from './dto/update-contact_us_query.dto';

@Injectable()
export class ContactUsQueriesService {
  create(createContactUsQueryDto: CreateContactUsQueryDto) {
    return 'This action adds a new contactUsQuery';
  }

  findAll() {
    return `This action returns all contactUsQueries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contactUsQuery`;
  }

  update(id: number, updateContactUsQueryDto: UpdateContactUsQueryDto) {
    return `This action updates a #${id} contactUsQuery`;
  }

  remove(id: number) {
    return `This action removes a #${id} contactUsQuery`;
  }
}
