import { PartialType } from '@nestjs/swagger';
import { CreateCacheMeDto } from './create-cache-me.dto';

export class UpdateCacheMeDto extends PartialType(CreateCacheMeDto) {}
