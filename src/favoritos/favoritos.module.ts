import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from '../models/entities/favoritos.entity';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito])],
  exports: [FavoritosService],
  controllers: [FavoritosController],
  providers: [FavoritosService],
})
export class FavoritosModule {}
 