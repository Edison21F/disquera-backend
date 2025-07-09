import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Artista } from '../models/entities/artistas.entity';
import { ArtistaMetadata } from '../models/schemas/artista-metadata.schema';
import { CreateArtistaDto } from './dto/create-artista.dto';
import { UpdateArtistaDto } from './dto/update-artista.dto';
import { ArtistaResponse } from './interfaces/artista-response.interface';

@Injectable()
export class ArtistasService {
  constructor(
    @InjectRepository(Artista)
    private readonly artistaRepository: Repository<Artista>,
    @InjectModel('ArtistaMetadata')
    private readonly artistaMetadataModel: Model<ArtistaMetadata>,
  ) {}

  async create(createArtistaDto: CreateArtistaDto): Promise<ArtistaResponse> {
    // Verificar si el artista ya existe
    const existing = await this.artistaRepository.findOne({
      where: { nombre: createArtistaDto.nombre }
    });

    if (existing) {
      throw new ConflictException('Ya existe un artista con ese nombre');
    }

    // Crear artista en MySQL
    const artista = this.artistaRepository.create({
      nombre: createArtistaDto.nombre,
      biografia: createArtistaDto.biografia,
      foto_url: createArtistaDto.foto_url || '',
    });

    const savedArtista = await this.artistaRepository.save(artista);

    // Actualizar relaciones si existen
    if (createArtistaDto.id_genero || createArtistaDto.id_pais || createArtistaDto.id_estado) {
      const updateData: any = {};
      
      if (createArtistaDto.id_genero) {
        updateData.genero = { id_genero: createArtistaDto.id_genero };
      }
      if (createArtistaDto.id_pais) {
        updateData.pais = { id_pais: createArtistaDto.id_pais };
      }
      if (createArtistaDto.id_estado) {
        updateData.estado = { id_estado: createArtistaDto.id_estado };
      }

      await this.artistaRepository.update(savedArtista.id, updateData);
    }

    // Crear metadatos en MongoDB si hay datos adicionales
    if (this.hasMetadata(createArtistaDto)) {
      const metadata = new this.artistaMetadataModel({
        id_artista: savedArtista.id,
        redes_sociales: createArtistaDto.redes_sociales || [],
        rider_tecnico: createArtistaDto.rider_tecnico || {},
        generos_secundarios: createArtistaDto.generos_secundarios || [],
        manager_contacto: createArtistaDto.manager_contacto || '',
        discografia_externa: createArtistaDto.discografia_externa || [],
      });
      await metadata.save();
    }

    return this.buildArtistaResponse(savedArtista);
  }

  async findAll(): Promise<ArtistaResponse[]> {
    const artistas = await this.artistaRepository.find({
      relations: ['genero', 'pais', 'estado'],
      order: { nombre: 'ASC' }
    });

    const artistasWithMetadata = await Promise.all(
      artistas.map(artista => this.buildArtistaResponse(artista))
    );

    return artistasWithMetadata;
  }

  async findOne(id: number): Promise<ArtistaResponse> {
    const artista = await this.artistaRepository.findOne({
      where: { id },
      relations: ['genero', 'pais', 'estado'],
    });

    if (!artista) {
      throw new NotFoundException(`Artista con ID ${id} no encontrado`);
    }

    return this.buildArtistaResponse(artista);
  }

  async findByName(nombre: string): Promise<ArtistaResponse | null> {
    const artista = await this.artistaRepository.findOne({
      where: { nombre },
      relations: ['genero', 'pais', 'estado'],
    });

    if (!artista) {
      return null;
    }

    return this.buildArtistaResponse(artista);
  }

  async findByGenero(generoId: number): Promise<ArtistaResponse[]> {
    const artistas = await this.artistaRepository.find({
      where: { genero: { id_genero: generoId } },
      relations: ['genero', 'pais', 'estado'],
    });

    return Promise.all(artistas.map(artista => this.buildArtistaResponse(artista)));
  }

  async findByPais(paisId: number): Promise<ArtistaResponse[]> {
    const artistas = await this.artistaRepository.find({
      where: { pais: { id_pais: paisId } },
      relations: ['genero', 'pais', 'estado'],
    });

    return Promise.all(artistas.map(artista => this.buildArtistaResponse(artista)));
  }

  async update(id: number, updateArtistaDto: UpdateArtistaDto): Promise<ArtistaResponse> {
    const artista = await this.artistaRepository.findOne({
      where: { id }
    });

    if (!artista) {
      throw new NotFoundException(`Artista con ID ${id} no encontrado`);
    }

    // Verificar nombre único si se actualiza
    if (updateArtistaDto.nombre && updateArtistaDto.nombre !== artista.nombre) {
      const existing = await this.findByName(updateArtistaDto.nombre);
      if (existing) {
        throw new ConflictException('Ya existe un artista con ese nombre');
      }
    }

    // Actualizar datos básicos
    const updateData: any = {};
    if (updateArtistaDto.nombre) updateData.nombre = updateArtistaDto.nombre;
    if (updateArtistaDto.biografia) updateData.biografia = updateArtistaDto.biografia;
    if (updateArtistaDto.foto_url !== undefined) updateData.foto_url = updateArtistaDto.foto_url;

    // Actualizar relaciones
    if (updateArtistaDto.id_genero !== undefined) {
      updateData.genero = updateArtistaDto.id_genero ? { id_genero: updateArtistaDto.id_genero } : null;
    }
    if (updateArtistaDto.id_pais !== undefined) {
      updateData.pais = updateArtistaDto.id_pais ? { id_pais: updateArtistaDto.id_pais } : null;
    }
    if (updateArtistaDto.id_estado !== undefined) {
      updateData.estado = updateArtistaDto.id_estado ? { id_estado: updateArtistaDto.id_estado } : null;
    }

    if (Object.keys(updateData).length > 0) {
      await this.artistaRepository.update(id, updateData);
    }

    // Actualizar metadatos en MongoDB
    if (this.hasMetadata(updateArtistaDto)) {
      const metadataUpdate: any = {};
      
      if (updateArtistaDto.redes_sociales !== undefined) metadataUpdate.redes_sociales = updateArtistaDto.redes_sociales;
      if (updateArtistaDto.rider_tecnico !== undefined) metadataUpdate.rider_tecnico = updateArtistaDto.rider_tecnico;
      if (updateArtistaDto.generos_secundarios !== undefined) metadataUpdate.generos_secundarios = updateArtistaDto.generos_secundarios;
      if (updateArtistaDto.manager_contacto !== undefined) metadataUpdate.manager_contacto = updateArtistaDto.manager_contacto;
      if (updateArtistaDto.discografia_externa !== undefined) metadataUpdate.discografia_externa = updateArtistaDto.discografia_externa;

      if (Object.keys(metadataUpdate).length > 0) {
        await this.artistaMetadataModel.findOneAndUpdate(
          { id_artista: id },
          metadataUpdate,
          { upsert: true, new: true }
        );
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const artista = await this.artistaRepository.findOne({
      where: { id }
    });

    if (!artista) {
      throw new NotFoundException(`Artista con ID ${id} no encontrado`);
    }

    // Eliminar metadatos de MongoDB
    await this.artistaMetadataModel.deleteOne({ id_artista: id });

    // Eliminar artista de MySQL
    await this.artistaRepository.remove(artista);
  }

  async updateEstadisticas(id: number, estadisticas: any): Promise<void> {
    await this.artistaMetadataModel.findOneAndUpdate(
      { id_artista: id },
      { estadisticas },
      { upsert: true }
    );
  }

  async addFechaImportante(id: number, fechaData: any): Promise<void> {
    await this.artistaMetadataModel.findOneAndUpdate(
      { id_artista: id },
      { $push: { fechas_importantes: fechaData } },
      { upsert: true }
    );
  }

  async searchArtistas(query: string): Promise<ArtistaResponse[]> {
    const artistas = await this.artistaRepository
      .createQueryBuilder('artista')
      .leftJoinAndSelect('artista.genero', 'genero')
      .leftJoinAndSelect('artista.pais', 'pais')
      .leftJoinAndSelect('artista.estado', 'estado')
      .where('artista.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('artista.biografia LIKE :query', { query: `%${query}%` })
      .getMany();

    return Promise.all(artistas.map(artista => this.buildArtistaResponse(artista)));
  }

  private async buildArtistaResponse(artista: Artista): Promise<ArtistaResponse> {
    // Obtener metadatos de MongoDB
    const metadata = await this.artistaMetadataModel.findOne({
      id_artista: artista.id
    }).lean();

    return {
      id: artista.id,
      nombre: artista.nombre,
      biografia: artista.biografia,
      foto_url: artista.foto_url,
      genero: artista.genero,
      pais: artista.pais,
      estado: artista.estado,
      metadatos: metadata ? {
        redes_sociales: metadata.redes_sociales,
        rider_tecnico: metadata.rider_tecnico,
        generos_secundarios: metadata.generos_secundarios,
        manager_contacto: metadata.manager_contacto,
        discografia_externa: metadata.discografia_externa,
      } : undefined,
    };
  }

  private hasMetadata(dto: CreateArtistaDto | UpdateArtistaDto): boolean {
    return !!(
      dto.redes_sociales || 
      dto.rider_tecnico || 
      dto.generos_secundarios || 
      dto.manager_contacto || 
      dto.discografia_externa
    );
  }
}
