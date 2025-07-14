import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArtistasService } from '../services/artistas.service';
import { CreateArtistaDto } from '../dto/create-artista.dto';
import { UpdateArtistaDto } from '../dto/update-artista.dto';

@Controller('artistas')
export class ArtistasController {
  constructor(private readonly artistasService: ArtistasService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  create(@Body() createArtistaDto: CreateArtistaDto) {
    return this.artistasService.create(createArtistaDto);
  }

  @Get()
  findAll() {
    return this.artistasService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.artistasService.searchArtistas(query);
  }

  @Get('genero/:generoId')
  findByGenero(@Param('generoId', ParseIntPipe) generoId: number) {
    return this.artistasService.findByGenero(generoId);
  }

  @Get('pais/:paisId')
  findByPais(@Param('paisId', ParseIntPipe) paisId: number) {
    return this.artistasService.findByPais(paisId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.artistasService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArtistaDto: UpdateArtistaDto,
  ) {
    return this.artistasService.update(id, updateArtistaDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.artistasService.remove(id);
  }

  @Patch(':id/estadisticas')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  updateEstadisticas(
    @Param('id', ParseIntPipe) id: number,
    @Body() estadisticas: any,
  ) {
    return this.artistasService.updateEstadisticas(id, estadisticas);
  }

  @Post(':id/fechas-importantes')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  addFechaImportante(
    @Param('id', ParseIntPipe) id: number,
    @Body() fechaData: any,
  ) {
    return this.artistasService.addFechaImportante(id, fechaData);
  }
}
