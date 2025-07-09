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
} from '@nestjs/common';
import { EstadosService } from './estados.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.create(createEstadoDto);
  }

  @Get()
  findAll() {
    return this.estadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoDto: UpdateEstadoDto,
  ) {
    return this.estadosService.update(id, updateEstadoDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estadosService.remove(id);
  }

  @Post('initialize')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  initializeStates() {
    return this.estadosService.initializeDefaultStates();
  }
}
