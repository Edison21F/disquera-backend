import { PartialType } from '@nestjs/mapped-types';
import { CreatePromocioneDto } from './create-promocione.dto';

export class UpdatePromocioneDto extends PartialType(CreatePromocioneDto) {}
