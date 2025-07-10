import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodosPagosService } from './metodos-pagos.service';
import { MetodosPagosController } from './metodos-pagos.controller';
import { MetodoPago } from '../models/entities/metodosPagos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago])],
  controllers: [MetodosPagosController],
  providers: [MetodosPagosService],
  exports: [MetodosPagosService],
})
export class MetodosPagosModule {}