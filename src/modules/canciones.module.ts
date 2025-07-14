import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancionesService } from '../services/canciones.service';
import { CancionesController } from '../controllers/canciones.controller';
import { Cancion } from '../models/entities/canciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cancion])],
  controllers: [CancionesController],
  providers: [CancionesService],
  exports: [CancionesService],
})
export class CancionesModule {}