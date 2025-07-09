import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';

@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post()
  create(@Body() createResenaDto: CreateResenaDto) {
    return this.resenasService.create(createResenaDto);
  }

  @Get()
  findAll() {
    return this.resenasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resenasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResenaDto: UpdateResenaDto) {
    return this.resenasService.update(+id, updateResenaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resenasService.remove(+id);
  }
}
