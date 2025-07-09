import { PartialType } from '@nestjs/mapped-types';
import { CreatePaisDto } from './create-paise.dto';

export class UpdatePaisDto extends PartialType(CreatePaisDto) {}