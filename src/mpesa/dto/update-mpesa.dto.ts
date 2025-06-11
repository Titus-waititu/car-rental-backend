import { PartialType } from '@nestjs/swagger';
import { CreateMpesaDto } from './create-mpesa.dto';

export class UpdateMpesaDto extends PartialType(CreateMpesaDto) {}
