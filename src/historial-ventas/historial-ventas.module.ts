import { Module } from '@nestjs/common';
import { HistorialVentasService } from './historial-ventas.service';
import { HistorialVentasController } from './historial-ventas.controller';

@Module({
  controllers: [HistorialVentasController],
  providers: [HistorialVentasService],
})
export class HistorialVentasModule {}
