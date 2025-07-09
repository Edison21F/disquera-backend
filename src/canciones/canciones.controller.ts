import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  Query 
} from '@nestjs/common';
import { CancionesService } from './canciones.service';
import { CreateCancionDto } from './dto/create-cancione.dto';
import { UpdateCancionDto } from './dto/update-cancione.dto';

@Controller('canciones')
export class CancionesController {
  constructor(private readonly cancionesService: CancionesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  create(@Body() createCancionDto: CreateCancionDto) {
    return this.cancionesService.create(createCancionDto);
  }

  @Get()
  findAll() {
    return this.cancionesService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.cancionesService.search(query);
  }

  @Get('singles')
  findSingles() {
    return this.cancionesService.findSingles();
  }

  @Get('album/:albumId')
  findByAlbum(@Param('albumId', ParseIntPipe) albumId: number) {
    return this.cancionesService.findByAlbum(albumId);
  }

  @Get('artista/:artistaId')
  findByArtista(@Param('artistaId', ParseIntPipe) artistaId: number) {
    return this.cancionesService.findByArtista(artistaId);
  }

  @Get('genero/:generoId')
  findByGenero(@Param('generoId', ParseIntPipe) generoId: number) {
    return this.cancionesService.findByGenero(generoId);
  }

  @Get('año/:año')
  findByYear(@Param('año', ParseIntPipe) año: number) {
    return this.cancionesService.findByYear(año);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cancionesService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCancionDto: UpdateCancionDto,
  ) {
    return this.cancionesService.update(id, updateCancionDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cancionesService.remove(id);
  }
}