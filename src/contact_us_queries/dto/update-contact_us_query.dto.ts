import { PartialType } from '@nestjs/mapped-types';
import { CreateContactUsQueryDto } from './create-contact_us_query.dto';

export class UpdateContactUsQueryDto extends PartialType(
  CreateContactUsQueryDto,
) {}
