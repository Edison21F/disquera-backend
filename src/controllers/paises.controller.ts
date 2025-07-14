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
import { PaisesService } from '../services/paises.service';
import { CreatePaisDto } from '../dto/create-paise.dto';
import { UpdatePaisDto } from '../dto/update-paise.dto';

@Controller('paises')
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  create(@Body() createPaisDto: CreatePaisDto) {
    return this.paisesService.create(createPaisDto);
  }

  @Get()
  findAll() {
    return this.paisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paisesService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaisDto: UpdatePaisDto,
  ) {
    return this.paisesService.update(id, updatePaisDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paisesService.remove(id);
  }

  @Post('initialize')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  initializeCountries() {
    return this.paisesService.initializeDefaultCountries();
  }
}