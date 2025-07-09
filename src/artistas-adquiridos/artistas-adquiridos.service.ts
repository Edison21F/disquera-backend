import { Injectable } from '@nestjs/common';
import { CreateArtistasAdquiridoDto } from './dto/create-artistas-adquirido.dto';
import { UpdateArtistasAdquiridoDto } from './dto/update-artistas-adquirido.dto';

@Injectable()
export class ArtistasAdquiridosService {
  create(createArtistasAdquiridoDto: CreateArtistasAdquiridoDto) {
    return 'This action adds a new artistasAdquirido';
  }

  findAll() {
    return `This action returns all artistasAdquiridos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artistasAdquirido`;
  }

  update(id: number, updateArtistasAdquiridoDto: UpdateArtistasAdquiridoDto) {
    return `This action updates a #${id} artistasAdquirido`;
  }

  remove(id: number) {
    return `This action removes a #${id} artistasAdquirido`;
  }
}
