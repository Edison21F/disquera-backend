import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionesService } from '../services/transacciones.service';
import { TransaccionesController } from '../controllers/transacciones.controller';
import { Transaccion } from '../models/entities/transacciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaccion])],
  controllers: [TransaccionesController],
  providers: [TransaccionesService],
  exports: [TransaccionesService],
})
export class TransaccionesModule {}