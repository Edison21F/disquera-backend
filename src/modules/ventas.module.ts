import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from '../services/ventas.service';
import { VentasController } from '../controllers/ventas.controller';
import { DetalleVenta } from '../models/entities/detalleVentas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta])],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}