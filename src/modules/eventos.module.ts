import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventosService } from '../services/eventos.service';
import { EventosController } from '../controllers/eventos.controller';
import { Evento } from '../models/entities/enventos.entity';
import { EventoMetadataSchema } from '../models/schemas/evento-metadata.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento]),
    MongooseModule.forFeature([
      { name: 'EventoMetadata', schema: EventoMetadataSchema }
    ]),
  ],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}