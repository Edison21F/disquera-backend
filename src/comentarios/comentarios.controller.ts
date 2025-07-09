import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  Query,
  UseGuards 
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { FilterComentariosDto } from './dto/filter-comentarios.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createComentarioDto: CreateComentarioDto) {
    return this.comentariosService.create(createComentarioDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterComentariosDto) {
    return this.comentariosService.findAll(filterDto);
  }

  @Get('stats')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  getStats() {
    return this.comentariosService.getCommentStats();
  }

  @Get('recent')
  findRecent(@Query('limit') limit?: number) {
    return this.comentariosService.findRecent(limit || 10);
  }

  @Get('search')
  searchComments(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.comentariosService.searchComments(query, page || 1, limit || 10);
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.comentariosService.findByProduct(productId, page || 1, limit || 10);
  }

  @Get('product/:productId/count')
  getProductCommentCount(@Param('productId', ParseIntPipe) productId: number) {
    return this.comentariosService.getProductCommentCount(productId);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard)
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.comentariosService.findByUser(userId, page || 1, limit || 10);
  }

  @Get('user/:userId/count')
  // @UseGuards(JwtAuthGuard)
  getUserCommentCount(@Param('userId', ParseIntPipe) userId: number) {
    return this.comentariosService.getUserCommentCount(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comentariosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComentarioDto: UpdateComentarioDto,
    // @CurrentUser() currentUser: any,
  ) {
    // const currentUserId = currentUser?.id_usuario;
    const currentUserId = undefined; // Reemplazar con el usuario actual
    return this.comentariosService.update(id, updateComentarioDto, currentUserId);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    // @CurrentUser() currentUser: any,
  ) {
    // const currentUserId = currentUser?.id_usuario;
    const currentUserId = undefined; // Reemplazar con el usuario actual
    return this.comentariosService.remove(id, currentUserId);
  }

  @Delete('product/:productId/all')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  removeByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.comentariosService.removeByProduct(productId);
  }

  @Delete('user/:userId/all')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  removeByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.comentariosService.removeByUser(userId);
  }
}