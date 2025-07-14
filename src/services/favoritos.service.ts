// src/favoritos/favoritos.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from '../models/entities/favoritos.entity';
import { CreateFavoritoDto } from '../dto/create-favorito.dto';
import { UpdateFavoritoDto } from '../dto/update-favorito.dto';
import { ToggleFavoritoDto } from '../dto/toggle-favorito.dto';
import { FavoritoResponse, FavoritosGroupedResponse } from '../interfaces/favorito-response.interface';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private readonly favoritoRepository: Repository<Favorito>,
  ) {}

  async create(createFavoritoDto: CreateFavoritoDto): Promise<FavoritoResponse> {
    // Verificar si ya existe en favoritos
    const existing = await this.favoritoRepository.findOne({
      where: {
        usuario: { id_usuario: createFavoritoDto.id_usuario },
        id_producto: createFavoritoDto.id_producto,
        tipo_producto: createFavoritoDto.tipo_producto
      }
    });

    if (existing) {
      throw new ConflictException('El producto ya está en favoritos');
    }

    const favorito = this.favoritoRepository.create({
      usuario: { id_usuario: createFavoritoDto.id_usuario },
      id_producto: createFavoritoDto.id_producto,
      tipo_producto: createFavoritoDto.tipo_producto,
    });

    const saved = await this.favoritoRepository.save(favorito);
    return this.buildFavoritoResponse(saved);
  }

  async toggle(userId: number, toggleFavoritoDto: ToggleFavoritoDto): Promise<{ added: boolean; favorito?: FavoritoResponse }> {
    const existing = await this.favoritoRepository.findOne({
      where: {
        usuario: { id_usuario: userId },
        id_producto: toggleFavoritoDto.id_producto,
        tipo_producto: toggleFavoritoDto.tipo_producto
      }
    });

    if (existing) {
      // Remover de favoritos
      await this.favoritoRepository.remove(existing);
      return { added: false };
    } else {
      // Agregar a favoritos
      const createDto: CreateFavoritoDto = {
        id_usuario: userId,
        id_producto: toggleFavoritoDto.id_producto,
        tipo_producto: toggleFavoritoDto.tipo_producto,
      };
      const favorito = await this.create(createDto);
      return { added: true, favorito };
    }
  }

  async findAll(): Promise<FavoritoResponse[]> {
    const favoritos = await this.favoritoRepository.find({
      relations: ['usuario'],
      order: { id_favorito: 'DESC' }
    });

    return favoritos.map(favorito => this.buildFavoritoResponse(favorito));
  }

  async findOne(id: number): Promise<FavoritoResponse> {
    const favorito = await this.favoritoRepository.findOne({
      where: { id_favorito: id },
      relations: ['usuario'],
    });

    if (!favorito) {
      throw new NotFoundException(`Favorito con ID ${id} no encontrado`);
    }

    return this.buildFavoritoResponse(favorito);
  }

  async findByUser(userId: number): Promise<FavoritosGroupedResponse> {
    const favoritos = await this.favoritoRepository.find({
      where: { usuario: { id_usuario: userId } },
      relations: ['usuario'],
      order: { id_favorito: 'DESC' }
    });

    const albums = favoritos
      .filter(f => f.tipo_producto === 'Album')
      .map(f => this.buildFavoritoResponse(f));

    const canciones = favoritos
      .filter(f => f.tipo_producto === 'Cancion')
      .map(f => this.buildFavoritoResponse(f));

    return {
      albums,
      canciones,
      total_albums: albums.length,
      total_canciones: canciones.length,
      total_general: favoritos.length,
    };
  }

  async findByUserAndType(userId: number, tipo: 'Album' | 'Cancion'): Promise<FavoritoResponse[]> {
    const favoritos = await this.favoritoRepository.find({
      where: { 
        usuario: { id_usuario: userId },
        tipo_producto: tipo 
      },
      relations: ['usuario'],
      order: { id_favorito: 'DESC' }
    });

    return favoritos.map(favorito => this.buildFavoritoResponse(favorito));
  }

  async findRecentByUser(userId: number, limit: number = 10): Promise<FavoritoResponse[]> {
    const favoritos = await this.favoritoRepository.find({
      where: { usuario: { id_usuario: userId } },
      relations: ['usuario'],
      order: { id_favorito: 'DESC' },
      take: limit
    });

    return favoritos.map(favorito => this.buildFavoritoResponse(favorito));
  }

  async isFavorite(userId: number, productId: number, tipo: 'Album' | 'Cancion'): Promise<boolean> {
    const favorito = await this.favoritoRepository.findOne({
      where: {
        usuario: { id_usuario: userId },
        id_producto: productId,
        tipo_producto: tipo
      }
    });

    return !!favorito;
  }

  async getFavoriteIds(userId: number, tipo?: 'Album' | 'Cancion'): Promise<number[]> {
    const whereCondition: any = {
      usuario: { id_usuario: userId }
    };

    if (tipo) {
      whereCondition.tipo_producto = tipo;
    }

    const favoritos = await this.favoritoRepository.find({
      where: whereCondition,
      select: ['id_producto']
    });

    return favoritos.map(f => f.id_producto);
  }

  async getPopularFavorites(tipo?: 'Album' | 'Cancion', limit: number = 10): Promise<any[]> {
    const queryBuilder = this.favoritoRepository
      .createQueryBuilder('favorito')
      .select('favorito.id_producto', 'id_producto')
      .addSelect('favorito.tipo_producto', 'tipo_producto')
      .addSelect('COUNT(*)', 'total_favoritos')
      .groupBy('favorito.id_producto, favorito.tipo_producto')
      .orderBy('total_favoritos', 'DESC')
      .limit(limit);

    if (tipo) {
      queryBuilder.where('favorito.tipo_producto = :tipo', { tipo });
    }

    return queryBuilder.getRawMany();
  }

  async getUserFavoriteStats(userId: number): Promise<any> {
    const stats = await this.favoritoRepository
      .createQueryBuilder('favorito')
      .select('favorito.tipo_producto', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('favorito.usuario = :userId', { userId })
      .groupBy('favorito.tipo_producto')
      .getRawMany();

    const result = {
      albums: 0,
      canciones: 0,
      total: 0
    };

    stats.forEach(stat => {
      if (stat.tipo === 'Album') {
        result.albums = parseInt(stat.cantidad);
      } else if (stat.tipo === 'Cancion') {
        result.canciones = parseInt(stat.cantidad);
      }
    });

    result.total = result.albums + result.canciones;
    return result;
  }

  async getFavoritesByGenre(userId: number, genero: string): Promise<FavoritoResponse[]> {
    // Esta función requeriría joins con las tablas de albums/canciones para obtener el género
    const queryBuilder = this.favoritoRepository
      .createQueryBuilder('favorito')
      .leftJoinAndSelect('favorito.usuario', 'usuario')
      .leftJoin('albums', 'album', 'favorito.id_producto = album.id AND favorito.tipo_producto = :albumType', { albumType: 'Album' })
      .leftJoin('canciones', 'cancion', 'favorito.id_producto = cancion.id AND favorito.tipo_producto = :cancionType', { cancionType: 'Cancion' })
      .leftJoin('generos', 'genero_album', 'album.id_genero = genero_album.id_genero')
      .leftJoin('generos', 'genero_cancion', 'cancion.id_genero = genero_cancion.id_genero')
      .where('favorito.usuario = :userId', { userId })
      .andWhere('(genero_album.nombre_genero = :genero OR genero_cancion.nombre_genero = :genero)', { genero });

    const favoritos = await queryBuilder.getMany();
    return favoritos.map(favorito => this.buildFavoritoResponse(favorito));
  }

  async getFavoritesByArtist(userId: number, artistaId: number): Promise<FavoritoResponse[]> {
    // Esta función requeriría joins con las tablas de albums/canciones para obtener el artista
    const queryBuilder = this.favoritoRepository
      .createQueryBuilder('favorito')
      .leftJoinAndSelect('favorito.usuario', 'usuario')
      .leftJoin('albums', 'album', 'favorito.id_producto = album.id AND favorito.tipo_producto = :albumType', { albumType: 'Album' })
      .leftJoin('canciones', 'cancion', 'favorito.id_producto = cancion.id AND favorito.tipo_producto = :cancionType', { cancionType: 'Cancion' })
      .where('favorito.usuario = :userId', { userId })
      .andWhere('(album.id_artista = :artistaId OR cancion.id_artista = :artistaId)', { artistaId });

    const favoritos = await queryBuilder.getMany();
    return favoritos.map(favorito => this.buildFavoritoResponse(favorito));
  }

  async getMostLikedContent(limit: number = 10): Promise<any[]> {
    const albums = await this.favoritoRepository
      .createQueryBuilder('favorito')
      .select('favorito.id_producto', 'id_producto')
      .addSelect('COUNT(*)', 'total_likes')
      .addSelect('"Album"', 'tipo')
      .where('favorito.tipo_producto = :tipo', { tipo: 'Album' })
      .groupBy('favorito.id_producto')
      .orderBy('total_likes', 'DESC')
      .limit(Math.ceil(limit / 2))
      .getRawMany();

    const canciones = await this.favoritoRepository
      .createQueryBuilder('favorito')
      .select('favorito.id_producto', 'id_producto')
      .addSelect('COUNT(*)', 'total_likes')
      .addSelect('"Cancion"', 'tipo')
      .where('favorito.tipo_producto = :tipo', { tipo: 'Cancion' })
      .groupBy('favorito.id_producto')
      .orderBy('total_likes', 'DESC')
      .limit(Math.ceil(limit / 2))
      .getRawMany();

    return [...albums, ...canciones]
      .sort((a, b) => b.total_likes - a.total_likes)
      .slice(0, limit);
  }

  async getRecommendationsBasedOnFavorites(userId: number, limit: number = 5): Promise<any[]> {
    // Obtener géneros favoritos del usuario
    const favoritesWithGenres = await this.favoritoRepository
      .createQueryBuilder('favorito')
      .leftJoin('albums', 'album', 'favorito.id_producto = album.id AND favorito.tipo_producto = :albumType', { albumType: 'Album' })
      .leftJoin('canciones', 'cancion', 'favorito.id_producto = cancion.id AND favorito.tipo_producto = :cancionType', { cancionType: 'Cancion' })
      .leftJoin('generos', 'genero_album', 'album.id_genero = genero_album.id_genero')
      .leftJoin('generos', 'genero_cancion', 'cancion.id_genero = genero_cancion.id_genero')
      .select('COALESCE(genero_album.id_genero, genero_cancion.id_genero)', 'id_genero')
      .addSelect('COUNT(*)', 'cantidad')
      .where('favorito.usuario = :userId', { userId })
      .groupBy('id_genero')
      .orderBy('cantidad', 'DESC')
      .limit(3)
      .getRawMany();

    // Aquí podrías implementar lógica más compleja para recomendaciones
    // Por ahora retorna los géneros más populares del usuario
    return favoritesWithGenres;
  }

  async getTrendingFavorites(days: number = 7, limit: number = 10): Promise<any[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - days);

    // Esta query asume que tienes un campo created_at en favoritos
    // Si no lo tienes, podrías agregarlo o usar id_favorito como proxy temporal
    const trending = await this.favoritoRepository
      .createQueryBuilder('favorito')
      .select('favorito.id_producto', 'id_producto')
      .addSelect('favorito.tipo_producto', 'tipo_producto')
      .addSelect('COUNT(*)', 'favoritos_recientes')
      // .where('favorito.created_at >= :fechaLimite', { fechaLimite }) // Agregar cuando tengas el campo
      .groupBy('favorito.id_producto, favorito.tipo_producto')
      .orderBy('favoritos_recientes', 'DESC')
      .limit(limit)
      .getRawMany();

    return trending;
  }

  async update(id: number, updateFavoritoDto: UpdateFavoritoDto): Promise<FavoritoResponse> {
    const favorito = await this.favoritoRepository.findOne({
      where: { id_favorito: id }
    });

    if (!favorito) {
      throw new NotFoundException(`Favorito con ID ${id} no encontrado`);
    }

    // Solo permitir actualizar tipo_producto
    if (updateFavoritoDto.tipo_producto) {
      favorito.tipo_producto = updateFavoritoDto.tipo_producto;
    }

    const updated = await this.favoritoRepository.save(favorito);
    return this.buildFavoritoResponse(updated);
  }

  async remove(id: number): Promise<void> {
    const favorito = await this.favoritoRepository.findOne({
      where: { id_favorito: id }
    });

    if (!favorito) {
      throw new NotFoundException(`Favorito con ID ${id} no encontrado`);
    }

    await this.favoritoRepository.remove(favorito);
  }

  async removeByUserAndProduct(userId: number, productId: number, tipo: 'Album' | 'Cancion'): Promise<void> {
    const favorito = await this.favoritoRepository.findOne({
      where: {
        usuario: { id_usuario: userId },
        id_producto: productId,
        tipo_producto: tipo
      }
    });

    if (!favorito) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoritoRepository.remove(favorito);
  }

  async clearUserFavorites(userId: number, tipo?: 'Album' | 'Cancion'): Promise<void> {
    const whereCondition: any = {
      usuario: { id_usuario: userId }
    };

    if (tipo) {
      whereCondition.tipo_producto = tipo;
    }

    const favoritos = await this.favoritoRepository.find({
      where: whereCondition
    });

    if (favoritos.length > 0) {
      await this.favoritoRepository.remove(favoritos);
    }
  }

  async bulkAddFavorites(userId: number, favoritesList: { id_producto: number; tipo_producto: 'Album' | 'Cancion' }[]): Promise<FavoritoResponse[]> {
    const results: FavoritoResponse[] = [];

    for (const item of favoritesList) {
      try {
        const favorito = await this.create({
          id_usuario: userId,
          id_producto: item.id_producto,
          tipo_producto: item.tipo_producto
        });
        results.push(favorito);
      } catch (error) {
        // Si ya existe, lo ignoramos y continuamos
        if (!(error instanceof ConflictException)) {
          throw error;
        }
      }
    }

    return results;
  }

  async exportUserFavorites(userId: number): Promise<any> {
    const favoritos = await this.findByUser(userId);
    
    return {
      user_id: userId,
      export_date: new Date(),
      total_favorites: favoritos.total_general,
      favorites: {
        albums: favoritos.albums.map(f => ({
          id_producto: f.id_producto,
          tipo: f.tipo_producto
        })),
        canciones: favoritos.canciones.map(f => ({
          id_producto: f.id_producto,
          tipo: f.tipo_producto
        }))
      }
    };
  }

  async importUserFavorites(userId: number, favoritesData: any): Promise<FavoritoResponse[]> {
    const allFavorites = [
      ...favoritesData.favorites.albums,
      ...favoritesData.favorites.canciones
    ];

    return this.bulkAddFavorites(userId, allFavorites);
  }

  async syncFavoritesWithExternalService(userId: number, externalFavorites: any[]): Promise<{ added: number; removed: number; total: number }> {
    // Obtener favoritos actuales
    const currentFavorites = await this.getFavoriteIds(userId);
    
    // Obtener IDs de favoritos externos
    const externalIds = externalFavorites.map(f => f.id_producto);
    
    // Encontrar favoritos a agregar
    const toAdd = externalFavorites.filter(f => !currentFavorites.includes(f.id_producto));
    
    // Encontrar favoritos a remover
    const toRemove = currentFavorites.filter(id => !externalIds.includes(id));
    
    // Agregar nuevos favoritos
    let addedCount = 0;
    for (const item of toAdd) {
      try {
        await this.create({
          id_usuario: userId,
          id_producto: item.id_producto,
          tipo_producto: item.tipo_producto
        });
        addedCount++;
      } catch (error) {
        // Ignorar errores de duplicados
      }
    }
    
    // Remover favoritos que ya no están
    let removedCount = 0;
    for (const productId of toRemove) {
      try {
        // Necesitarías implementar una forma de determinar el tipo
        // o hacer dos intentos (Album y Cancion)
        const favorito = await this.favoritoRepository.findOne({
          where: {
            usuario: { id_usuario: userId },
            id_producto: productId
          }
        });
        
        if (favorito) {
          await this.favoritoRepository.remove(favorito);
          removedCount++;
        }
      } catch (error) {
        // Ignorar errores
      }
    }
    
    const finalStats = await this.getUserFavoriteStats(userId);
    
    return {
      added: addedCount,
      removed: removedCount,
      total: finalStats.total
    };
  }

  private buildFavoritoResponse(favorito: Favorito): FavoritoResponse {
    return {
      id_favorito: favorito.id_favorito,
      id_producto: favorito.id_producto,
      tipo_producto: favorito.tipo_producto as 'Album' | 'Cancion',
      fecha_agregado: new Date(), // Podrías agregar este campo a la entidad
      usuario: favorito.usuario,
      // El producto_info se completaría con joins a las tablas correspondientes
    };
  }
}