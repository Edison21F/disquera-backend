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
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { FilterResenasDto } from './dto/filter-resenas.dto';

@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createResenaDto: CreateResenaDto) {
    return this.resenasService.create(createResenaDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterResenasDto) {
    return this.resenasService.findAll(filterDto);
  }

  @Get('stats')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  getStats() {
    return this.resenasService.getResenasStats();
  }

  @Get('top-rated')
  getTopRated(@Query('limit') limit?: number) {
    return this.resenasService.getTopRatedProducts(limit || 10);
  }

  @Get('search')
  searchResenas(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.resenasService.searchResenas(query, page || 1, limit || 10);
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.resenasService.findByProduct(productId, page || 1, limit || 10);
  }

  @Get('product/:productId/summary')
  getProductSummary(@Param('productId', ParseIntPipe) productId: number) {
    return this.resenasService.getProductRatingsSummary(productId);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard)
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.resenasService.findByUser(userId, page || 1, limit || 10);
  }

  @Get('user/:userId/product/:productId')
  // @UseGuards(JwtAuthGuard)
  getUserResenaForProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.resenasService.getUserResenaForProduct(userId, productId);
  }

  @Get('user/:userId/product/:productId/has-reviewed')
  // @UseGuards(JwtAuthGuard)
  hasUserReviewed(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.resenasService.hasUserReviewed(userId, productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resenasService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResenaDto: UpdateResenaDto,
    // @CurrentUser() currentUser: any,
  ) {
    // const currentUserId = currentUser?.id_usuario;
    const currentUserId = undefined; // Reemplazar con el usuario actual
    return this.resenasService.update(id, updateResenaDto, currentUserId);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    // @CurrentUser() currentUser: any,
  ) {
    // const currentUserId = currentUser?.id_usuario;
    const currentUserId = undefined; // Reemplazar con el usuario actual
    return this.resenasService.remove(id, currentUserId);
  }

  @Delete('product/:productId/all')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  removeByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.resenasService.removeByProduct(productId);
  }

  @Delete('user/:userId/all')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  removeByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.resenasService.removeByUser(userId);
  }
}