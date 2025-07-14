import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerosService } from '../services/generos.service';
import { GenerosController } from '../controllers/generos.controller';
import { Genero } from '../models/entities/generos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Genero])],
  controllers: [GenerosController],
  providers: [GenerosService],
  exports: [GenerosService],
})
export class GenerosModule {}
