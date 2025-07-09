import { Module } from '@nestjs/common';
import { CancionesService } from './canciones.service';
import { CancionesController } from './canciones.controller';

@Module({
  controllers: [CancionesController],
  providers: [CancionesService],
})
export class CancionesModule {}
