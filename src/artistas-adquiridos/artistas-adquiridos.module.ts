import { Module } from '@nestjs/common';
import { ArtistasAdquiridosService } from './artistas-adquiridos.service';
import { ArtistasAdquiridosController } from './artistas-adquiridos.controller';

@Module({
  controllers: [ArtistasAdquiridosController],
  providers: [ArtistasAdquiridosService],
})
export class ArtistasAdquiridosModule {}
