import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../models/entities/albums.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { AlbumResponse } from '../interfaces/album-response.interface';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumResponse> {
    // Verificar si ya existe un álbum con el mismo título del mismo artista
    const existing = await this.albumRepository.findOne({
      where: { 
        titulo: createAlbumDto.titulo,
        artista: { id: createAlbumDto.id_artista }
      }
    });

    if (existing) {
      throw new ConflictException('Ya existe un álbum con ese título para este artista');
    }

    const album = this.albumRepository.create({
      titulo: createAlbumDto.titulo,
      año: createAlbumDto.año,
      foto_url: createAlbumDto.foto_url || '',
      artista: { id: createAlbumDto.id_artista },
      genero: { id_genero: createAlbumDto.id_genero },
      estado: createAlbumDto.id_estado ? { id_estado: createAlbumDto.id_estado } : undefined,
    });

    const savedAlbum = await this.albumRepository.save(album);
    return this.buildAlbumResponse(savedAlbum);
  }

  async findAll(): Promise<AlbumResponse[]> {
    const albums = await this.albumRepository.find({
      relations: ['artista', 'genero', 'estado'],
      order: { año: 'DESC', titulo: 'ASC' }
    });

    return albums.map(album => this.buildAlbumResponse(album));
  }

  async findOne(id: number): Promise<AlbumResponse> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artista', 'genero', 'estado'],
    });

    if (!album) {
      throw new NotFoundException(`Álbum con ID ${id} no encontrado`);
    }

    return this.buildAlbumResponse(album);
  }

  async findByArtista(artistaId: number): Promise<AlbumResponse[]> {
    const albums = await this.albumRepository.find({
      where: { artista: { id: artistaId } },
      relations: ['artista', 'genero', 'estado'],
      order: { año: 'DESC' }
    });

    return albums.map(album => this.buildAlbumResponse(album));
  }

  async findByGenero(generoId: number): Promise<AlbumResponse[]> {
    const albums = await this.albumRepository.find({
      where: { genero: { id_genero: generoId } },
      relations: ['artista', 'genero', 'estado'],
      order: { año: 'DESC' }
    });

    return albums.map(album => this.buildAlbumResponse(album));
  }

  async findByYear(año: number): Promise<AlbumResponse[]> {
    const albums = await this.albumRepository.find({
      where: { año },
      relations: ['artista', 'genero', 'estado'],
      order: { titulo: 'ASC' }
    });

    return albums.map(album => this.buildAlbumResponse(album));
  }

  async search(query: string): Promise<AlbumResponse[]> {
    const albums = await this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.artista', 'artista')
      .leftJoinAndSelect('album.genero', 'genero')
      .leftJoinAndSelect('album.estado', 'estado')
      .where('album.titulo LIKE :query', { query: `%${query}%` })
      .orWhere('artista.nombre LIKE :query', { query: `%${query}%` })
      .getMany();

    return albums.map(album => this.buildAlbumResponse(album));
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto): Promise<AlbumResponse> {
    const album = await this.albumRepository.findOne({
      where: { id }
    });

    if (!album) {
      throw new NotFoundException(`Álbum con ID ${id} no encontrado`);
    }

    // Verificar título único si se actualiza
    if (updateAlbumDto.titulo && updateAlbumDto.titulo !== album.titulo) {
      const existing = await this.albumRepository.findOne({
        where: { 
          titulo: updateAlbumDto.titulo,
          artista: { id: updateAlbumDto.id_artista || album.artista?.id }
        }
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un álbum con ese título para este artista');
      }
    }

    // Preparar datos de actualización
    const updateData: any = {};
    if (updateAlbumDto.titulo) updateData.titulo = updateAlbumDto.titulo;
    if (updateAlbumDto.año) updateData.año = updateAlbumDto.año;
    if (updateAlbumDto.foto_url !== undefined) updateData.foto_url = updateAlbumDto.foto_url;

    // Actualizar relaciones
    if (updateAlbumDto.id_artista) {
      updateData.artista = { id: updateAlbumDto.id_artista };
    }
    if (updateAlbumDto.id_genero) {
      updateData.genero = { id_genero: updateAlbumDto.id_genero };
    }
    if (updateAlbumDto.id_estado !== undefined) {
      updateData.estado = updateAlbumDto.id_estado ? { id_estado: updateAlbumDto.id_estado } : null;
    }

    await this.albumRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const album = await this.albumRepository.findOne({
      where: { id }
    });

    if (!album) {
      throw new NotFoundException(`Álbum con ID ${id} no encontrado`);
    }

    await this.albumRepository.remove(album);
  }

  private buildAlbumResponse(album: Album): AlbumResponse {
    return {
      id: album.id,
      titulo: album.titulo,
      año: album.año,
      foto_url: album.foto_url,
      artista: album.artista,
      genero: album.genero,
      estado: album.estado,
    };
  }
}