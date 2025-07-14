
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenasService } from '../services/resenas.service';
import { ResenasController } from '../controllers/resenas.controller';
import { Resena } from '../models/entities/resenas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resena])],
  controllers: [ResenasController],
  providers: [ResenasService],
  exports: [ResenasService],
})
export class ResenasModule{} 