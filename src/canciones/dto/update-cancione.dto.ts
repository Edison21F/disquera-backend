import { PartialType } from '@nestjs/mapped-types';
import { CreateCancioneDto } from './create-cancione.dto';

export class UpdateCancioneDto extends PartialType(CreateCancioneDto) {}
