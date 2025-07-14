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
import { ManagersService } from '../services/managers.service';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { UpdateManagerDto } from '../dto/update-manager.dto';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  findAll() {
    return this.managersService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.managersService.search(query);
  }

  @Get('active')
  findActive() {
    return this.managersService.findActive();
  }

  @Get('genero/:genero')
  findByGenre(@Param('genero') genero: string) {
    return this.managersService.findByGenre(genero);
  }

  @Get('servicio/:servicio')
  getByService(@Param('servicio') servicio: string) {
    return this.managersService.getManagersByService(servicio);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.managersService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManagerDto: UpdateManagerDto,
  ) {
    return this.managersService.update(id, updateManagerDto);
  }

  @Patch(':id/estadisticas')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  updateEstadisticas(
    @Param('id', ParseIntPipe) id: number,
    @Body() estadisticas: any,
  ) {
    return this.managersService.updateEstadisticas(id, estadisticas);
  }

  @Post(':id/certificaciones')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  addCertificacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() certificacion: any,
  ) {
    return this.managersService.addCertificacion(id, certificacion);
  }

  @Delete(':id/certificaciones/:certId')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  removeCertificacion(
    @Param('id', ParseIntPipe) id: number,
    @Param('certId') certId: string,
  ) {
    return this.managersService.removeCertificacion(id, certId);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.managersService.remove(id);
  }
}