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
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { UpdateFavoritoDto } from './dto/update-favorito.dto';
import { ToggleFavoritoDto } from './dto/toggle-favorito.dto';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  create(@Body() createFavoritoDto: CreateFavoritoDto) {
    return this.favoritosService.create(createFavoritoDto);
  }

  @Post('toggle/:userId')
  // @UseGuards(JwtAuthGuard)
  toggle(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() toggleFavoritoDto: ToggleFavoritoDto,
  ) {
    return this.favoritosService.toggle(userId, toggleFavoritoDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  findAll() {
    return this.favoritosService.findAll();
  }

  @Get('popular')
  getPopularFavorites(
    @Query('tipo') tipo?: 'Album' | 'Cancion',
    @Query('limit') limit?: number,
  ) {
    return this.favoritosService.getPopularFavorites(tipo, limit || 10);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.favoritosService.findByUser(userId);
  }

  @Get('user/:userId/type/:tipo')
  // @UseGuards(JwtAuthGuard)
  findByUserAndType(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('tipo') tipo: 'Album' | 'Cancion',
  ) {
    return this.favoritosService.findByUserAndType(userId, tipo);
  }

  @Get('user/:userId/recent')
  // @UseGuards(JwtAuthGuard)
  findRecentByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: number,
  ) {
    return this.favoritosService.findRecentByUser(userId, limit || 10);
  }

  @Get('user/:userId/stats')
  // @UseGuards(JwtAuthGuard)
  getUserStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.favoritosService.getUserFavoriteStats(userId);
  }

  @Get('user/:userId/ids')
  // @UseGuards(JwtAuthGuard)
  getFavoriteIds(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('tipo') tipo?: 'Album' | 'Cancion',
  ) {
    return this.favoritosService.getFavoriteIds(userId, tipo);
  }

  @Get('check/:userId/:productId/:tipo')
  // @UseGuards(JwtAuthGuard)
  checkIsFavorite(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('tipo') tipo: 'Album' | 'Cancion',
  ) {
    return this.favoritosService.isFavorite(userId, productId, tipo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.favoritosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFavoritoDto: UpdateFavoritoDto,
  ) {
    return this.favoritosService.update(id, updateFavoritoDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.favoritosService.remove(id);
  }

  @Delete('user/:userId/product/:productId/:tipo')
  // @UseGuards(JwtAuthGuard)
  removeByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('tipo') tipo: 'Album' | 'Cancion',
  ) {
    return this.favoritosService.removeByUserAndProduct(userId, productId, tipo);
  }

  @Delete('user/:userId/clear')
  // @UseGuards(JwtAuthGuard)
  clearUserFavorites(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('tipo') tipo?: 'Album' | 'Cancion',
  ) {
    return this.favoritosService.clearUserFavorites(userId, tipo);
  }
}
