import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistasService } from './artistas.service';
import { ArtistasController } from './artistas.controller';
import { Artista } from '../models/entities/artistas.entity';
import { ArtistaMetadataSchema } from '../models/schemas/artista-metadata.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artista]),
    MongooseModule.forFeature([
      { name: 'ArtistaMetadata', schema: ArtistaMetadataSchema }
    ]),
  ],
  controllers: [ArtistasController],
  providers: [ArtistasService],
  exports: [ArtistasService],
})
export class ArtistasModule {}
