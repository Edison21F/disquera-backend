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
import { GenerosService } from '../services/generos.service';
import { CreateGeneroDto } from '../dto/create-genero.dto';
import { UpdateGeneroDto } from '../dto/update-genero.dto';

@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  create(@Body() createGeneroDto: CreateGeneroDto) {
    return this.generosService.create(createGeneroDto);
  }

  @Get()
  findAll() {
    return this.generosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.generosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGeneroDto: UpdateGeneroDto,
  ) {
    return this.generosService.update(id, updateGeneroDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.generosService.remove(id);
  }

  @Post('initialize')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  initializeGeneros() {
    return this.generosService.initializeDefaultGeneros();
  }
}