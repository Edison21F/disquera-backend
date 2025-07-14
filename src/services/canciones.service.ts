import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Cancion } from '../models/entities/canciones.entity';
import { CreateCancionDto } from '../dto/create-cancione.dto';
import { UpdateCancionDto } from '../dto/update-cancione.dto';
import { CancionResponse } from '../interfaces/cancion-response.interface';

@Injectable()
export class CancionesService {
  constructor(
    @InjectRepository(Cancion)
    private readonly cancionRepository: Repository<Cancion>,
  ) {}

  async create(createCancionDto: CreateCancionDto): Promise<CancionResponse> {
    // Verificar si ya existe una canción con el mismo título del mismo artista
    const existing = await this.cancionRepository.findOne({
      where: { 
        titulo: createCancionDto.titulo,
        artista: { id: createCancionDto.id_artista }
      }
    });

    if (existing) {
      throw new ConflictException('Ya existe una canción con ese título para este artista');
    }

    // Validar formato de duración (mm:ss)
    if (!this.isValidDuration(createCancionDto.duracion)) {
      throw new ConflictException('Formato de duración inválido. Use mm:ss');
    }

    const cancion = this.cancionRepository.create({
      titulo: createCancionDto.titulo,
      duracion: createCancionDto.duracion,
      año: createCancionDto.año,
      foto_url: createCancionDto.foto_url || '',
      album: createCancionDto.id_album ? { id: createCancionDto.id_album } : undefined,
      genero: { id_genero: createCancionDto.id_genero },
      artista: { id: createCancionDto.id_artista },
      estado: createCancionDto.id_estado ? { id_estado: createCancionDto.id_estado } : undefined,
    });

    const savedCancion = await this.cancionRepository.save(cancion);
    return this.buildCancionResponse(savedCancion);
  }

  async findAll(): Promise<CancionResponse[]> {
    const canciones = await this.cancionRepository.find({
      relations: ['album', 'genero', 'estado', 'artista'],
      order: { año: 'DESC', titulo: 'ASC' }
    });

    return canciones.map(cancion => this.buildCancionResponse(cancion));
  }

  async findOne(id: number): Promise<CancionResponse> {
    const cancion = await this.cancionRepository.findOne({
      where: { id },
      relations: ['album', 'genero', 'estado', 'artista'],
    });

    if (!cancion) {
      throw new NotFoundException(`Canción con ID ${id} no encontrada`);
    }

    return this.buildCancionResponse(cancion);
  }

  async findByAlbum(albumId: number): Promise<CancionResponse[]> {
    const canciones = await this.cancionRepository.find({
      where: { album: { id: albumId } },
      relations: ['album', 'genero', 'estado', 'artista'],
      order: { titulo: 'ASC' }
    });

    return canciones.map(cancion => this.buildCancionResponse(cancion));
  }

  async findByArtista(artistaId: number): Promise<CancionResponse[]> {
    const canciones = await this.cancionRepository.find({
      where: { artista: { id: artistaId } },
      relations: ['album', 'genero', 'estado', 'artista'],
      order: { año: 'DESC', titulo: 'ASC' }
    });

    return canciones.map(cancion => this.buildCancionResponse(cancion));
  }

  async findByGenero(generoId: number): Promise<CancionResponse[]> {
    const canciones = await this.cancionRepository.find({
      where: { genero: { id_genero: generoId } },
      relations: ['album', 'genero', 'estado', 'artista'],
      order: { año: 'DESC' }
    });

    return canciones.map(cancion => this.buildCancionResponse(cancion));
  }

  async findByYear(año: number): Promise<CancionResponse[]> {
    const canciones = await this.cancionRepository.find({
      where: { año },
      relations: ['album', 'genero', 'estado', 'artista'],
      order: { titulo: 'ASC' }
    });

    return canciones.map(cancion => this.buildCancionResponse(cancion));
  }

  async search(query: string): Promise<CancionResponse[]> {
    const canciones = await this.cancionRepository
      .createQueryBuilder('cancion')
      .leftJoinAndSelect('cancion.album', 'album')
      .leftJoinAndSelect('cancion.genero', 'genero')
      .leftJoinAndSelect('cancion.estado', 'estado')
      .leftJoinAndSelect('cancion.artista', 'artista')
      .where('cancion.titulo LIKE :query', { query: `%${query}%` })
      .orWhere('artista.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('album.titulo LIKE :query', { query: `%${query}%` })
      .getMany();

    return canciones.map(cancion => this.buildCancionResponse(cancion));
  }

  async findSingles(): Promise<CancionResponse[]> {
    const canciones = await this.cancionRepository.find({
      where: { album: require('typeorm').IsNull() },
      relations: ['album', 'genero', 'estado', 'artista'],
      order: { año: 'DESC', titulo: 'ASC' }
    });

    return canciones.map(cancion => this.buildCancionResponse(cancion));
  }

  async update(id: number, updateCancionDto: UpdateCancionDto): Promise<CancionResponse> {
    const cancion = await this.cancionRepository.findOne({
      where: { id }
    });

    if (!cancion) {
      throw new NotFoundException(`Canción con ID ${id} no encontrada`);
    }

    // Verificar título único si se actualiza
    if (updateCancionDto.titulo && updateCancionDto.titulo !== cancion.titulo) {
      const existing = await this.cancionRepository.findOne({
        where: { 
          titulo: updateCancionDto.titulo,
          artista: { id: updateCancionDto.id_artista || cancion.artista?.id }
        }
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe una canción con ese título para este artista');
      }
    }

    // Validar duración si se actualiza
    if (updateCancionDto.duracion && !this.isValidDuration(updateCancionDto.duracion)) {
      throw new ConflictException('Formato de duración inválido. Use mm:ss');
    }

    // Preparar datos de actualización
    const updateData: any = {};
    if (updateCancionDto.titulo) updateData.titulo = updateCancionDto.titulo;
    if (updateCancionDto.duracion) updateData.duracion = updateCancionDto.duracion;
    if (updateCancionDto.año) updateData.año = updateCancionDto.año;
    if (updateCancionDto.foto_url !== undefined) updateData.foto_url = updateCancionDto.foto_url;

    // Actualizar relaciones
    if (updateCancionDto.id_album !== undefined) {
      updateData.album = updateCancionDto.id_album ? { id: updateCancionDto.id_album } : null;
    }
    if (updateCancionDto.id_genero) {
      updateData.genero = { id_genero: updateCancionDto.id_genero };
    }
    if (updateCancionDto.id_artista) {
      updateData.artista = { id: updateCancionDto.id_artista };
    }
    if (updateCancionDto.id_estado !== undefined) {
      updateData.estado = updateCancionDto.id_estado ? { id_estado: updateCancionDto.id_estado } : null;
    }

    await this.cancionRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const cancion = await this.cancionRepository.findOne({
      where: { id }
    });

    if (!cancion) {
      throw new NotFoundException(`Canción con ID ${id} no encontrada`);
    }

    await this.cancionRepository.remove(cancion);
  }

  private buildCancionResponse(cancion: Cancion): CancionResponse {
    return {
      id: cancion.id,
      titulo: cancion.titulo,
      duracion: cancion.duracion,
      año: cancion.año,
      foto_url: cancion.foto_url,
      album: cancion.album,
      genero: cancion.genero,
      estado: cancion.estado,
      artista: cancion.artista,
    };
  }

  private isValidDuration(duration: string): boolean {
    const regex = /^\d{1,2}:\d{2}$/;
    if (!regex.test(duration)) return false;
    
    const [minutes, seconds] = duration.split(':').map(Number);
    return seconds < 60;
  }
}