import { Module } from '@nestjs/common';
import { EventMetadataService } from './event-metadata.service';
import { EventMetadataController } from './event-metadata.controller';

@Module({
  controllers: [EventMetadataController],
  providers: [EventMetadataService],
})
export class EventMetadataModule {}
