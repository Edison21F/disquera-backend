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
import { SexosService } from './sexos.service';
import { CreateSexoDto } from './dto/create-sexo.dto';
import { UpdateSexoDto } from './dto/update-sexo.dto';

@Controller('sexos')
export class SexosController {
  constructor(private readonly sexosService: SexosService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  create(@Body() createSexoDto: CreateSexoDto) {
    return this.sexosService.create(createSexoDto);
  }

  @Get()
  findAll() {
    return this.sexosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sexosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSexoDto: UpdateSexoDto,
  ) {
    return this.sexosService.update(id, updateSexoDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sexosService.remove(id);
  }

  @Post('initialize')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  initializeOptions() {
    return this.sexosService.initializeDefaultOptions();
  }
}