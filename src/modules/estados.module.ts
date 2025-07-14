import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosService } from '../services/estados.service';
import { EstadosController } from '../controllers/estados.controller';
import { Estado } from '../models/entities/estados.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  controllers: [EstadosController],
  providers: [EstadosService],
  exports: [EstadosService], // Exportamos para usar en otros módulos
})
export class EstadosModule {}
