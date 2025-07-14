import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SexosService } from '../services/sexos.service';
import { SexosController } from '../controllers/sexos.controller';
import { Sexo } from '../models/entities/sexo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sexo])],
  controllers: [SexosController],
  providers: [SexosService],
  exports: [SexosService],
})
export class SexosModule {}
