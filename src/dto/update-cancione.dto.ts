import { PartialType } from '@nestjs/mapped-types';
import { CreateCancionDto } from './create-cancione.dto';

export class UpdateCancionDto extends PartialType(CreateCancionDto) {}
