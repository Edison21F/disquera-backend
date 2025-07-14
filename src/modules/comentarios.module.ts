import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentariosService } from '../services/comentarios.service';
import { ComentariosController } from '../controllers/comentarios.controller';
import { Comentario } from '../models/entities/comentarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService],
})
export class ComentariosModule {}