import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisesService } from '../services/paises.service';
import { PaisesController } from '../controllers/paises.controller';
import { Pais } from '../models/entities/paises.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pais])],
  controllers: [PaisesController],
  providers: [PaisesService],
  exports: [PaisesService],
})
export class PaisesModule {}
