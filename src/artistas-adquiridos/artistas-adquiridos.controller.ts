import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtistasAdquiridosService } from './artistas-adquiridos.service';
import { CreateArtistasAdquiridoDto } from './dto/create-artistas-adquirido.dto';
import { UpdateArtistasAdquiridoDto } from './dto/update-artistas-adquirido.dto';

@Controller('artistas-adquiridos')
export class ArtistasAdquiridosController {
  constructor(private readonly artistasAdquiridosService: ArtistasAdquiridosService) {}

  @Post()
  create(@Body() createArtistasAdquiridoDto: CreateArtistasAdquiridoDto) {
    return this.artistasAdquiridosService.create(createArtistasAdquiridoDto);
  }

  @Get()
  findAll() {
    return this.artistasAdquiridosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistasAdquiridosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtistasAdquiridoDto: UpdateArtistasAdquiridoDto) {
    return this.artistasAdquiridosService.update(+id, updateArtistasAdquiridoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistasAdquiridosService.remove(+id);
  }
}
