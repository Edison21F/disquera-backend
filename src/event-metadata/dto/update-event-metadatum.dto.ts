import { PartialType } from '@nestjs/mapped-types';
import { CreateEventMetadatumDto } from './create-event-metadatum.dto';

export class UpdateEventMetadatumDto extends PartialType(CreateEventMetadatumDto) {}
