import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventMetadataService } from './event-metadata.service';
import { CreateEventMetadatumDto } from './dto/create-event-metadatum.dto';
import { UpdateEventMetadatumDto } from './dto/update-event-metadatum.dto';

@Controller('event-metadata')
export class EventMetadataController {
  constructor(private readonly eventMetadataService: EventMetadataService) {}

  @Post()
  create(@Body() createEventMetadatumDto: CreateEventMetadatumDto) {
    return this.eventMetadataService.create(createEventMetadatumDto);
  }

  @Get()
  findAll() {
    return this.eventMetadataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventMetadataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventMetadatumDto: UpdateEventMetadatumDto) {
    return this.eventMetadataService.update(+id, updateEventMetadatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventMetadataService.remove(+id);
  }
}
