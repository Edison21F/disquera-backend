import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SexosService } from './sexos.service';
import { SexosController } from './sexos.controller';
import { Sexo } from '../models/entities/sexo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sexo])],
  controllers: [SexosController],
  providers: [SexosService],
  exports: [SexosService],
})
export class SexosModule {}
