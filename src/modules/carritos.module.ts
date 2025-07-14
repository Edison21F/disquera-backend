import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritosService } from '../services/carritos.service';
import { CarritosController } from '../controllers/carritos.controller';
import { Carrito } from '../models/entities/carritos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito])],
  controllers: [CarritosController],
  providers: [CarritosService],
  exports: [CarritosService],
})
export class CarritosModule {}