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
import { EventosService } from '../services/eventos.service';
import { CreateEventoDto } from '../dto/create-evento.dto';
import { UpdateEventoDto } from '../dto/update-evento.dto';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.create(createEventoDto);
  }

  @Get()
  findAll() {
    return this.eventosService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.eventosService.search(query);
  }

  @Get('upcoming')
  findUpcoming() {
    return this.eventosService.findUpcoming();
  }

  @Get('artista/:artistaId')
  findByArtista(@Param('artistaId', ParseIntPipe) artistaId: number) {
    return this.eventosService.findByArtista(artistaId);
  }

  @Get('genero/:generoId')
  findByGenero(@Param('generoId', ParseIntPipe) generoId: number) {
    return this.eventosService.findByGenero(generoId);
  }

  @Get('fecha-rango')
  findByDateRange(
    @Query('inicio') fechaInicio: string,
    @Query('fin') fechaFin: string,
  ) {
    return this.eventosService.findByDateRange(fechaInicio, fechaFin);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventoDto: UpdateEventoDto,
  ) {
    return this.eventosService.update(id, updateEventoDto);
  }

  @Patch(':id/estadisticas')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  updateEstadisticas(
    @Param('id', ParseIntPipe) id: number,
    @Body() estadisticas: any,
  ) {
    return this.eventosService.updateEstadisticas(id, estadisticas);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.remove(id);
  }
}
