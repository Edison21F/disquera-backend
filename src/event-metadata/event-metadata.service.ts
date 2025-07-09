import { Injectable } from '@nestjs/common';
import { CreateEventMetadatumDto } from './dto/create-event-metadatum.dto';
import { UpdateEventMetadatumDto } from './dto/update-event-metadatum.dto';

@Injectable()
export class EventMetadataService {
  create(createEventMetadatumDto: CreateEventMetadatumDto) {
    return 'This action adds a new eventMetadatum';
  }

  findAll() {
    return `This action returns all eventMetadata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventMetadatum`;
  }

  update(id: number, updateEventMetadatumDto: UpdateEventMetadatumDto) {
    return `This action updates a #${id} eventMetadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventMetadatum`;
  }
}
