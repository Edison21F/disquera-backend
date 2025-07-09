import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Evento } from '../models/entities/enventos.entity';
import { EventoMetadata } from '../models/schemas/evento-metadata.schema';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { EventoResponse } from './interfaces/evento-response.interface';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    @InjectModel('EventoMetadata')
    private readonly eventoMetadataModel: Model<EventoMetadata>,
  ) {}

  async create(createEventoDto: CreateEventoDto): Promise<EventoResponse> {
    // Verificar si ya existe un evento con el mismo nombre en la misma fecha
    const existing = await this.eventoRepository.findOne({
      where: { 
        nombre_evento: createEventoDto.nombre_evento,
        fecha_evento: new Date(createEventoDto.fecha_evento)
      }
    });

    if (existing) {
      throw new ConflictException('Ya existe un evento con ese nombre en la misma fecha');
    }

    // Validar formato de hora (HH:mm)
    if (!this.isValidTime(createEventoDto.hora_evento)) {
      throw new ConflictException('Formato de hora inválido. Use HH:mm');
    }

    // Crear evento en MySQL
    const evento = this.eventoRepository.create({
      nombre_evento: createEventoDto.nombre_evento,
      descripcion: createEventoDto.descripcion,
      ubicacion: createEventoDto.ubicacion,
      fecha_evento: new Date(createEventoDto.fecha_evento),
      hora_evento: createEventoDto.hora_evento,
      capacidad: createEventoDto.capacidad,
      contacto: createEventoDto.contacto,
      url_flyer_evento: createEventoDto.url_flyer_evento || '',
      estado: { id_estado: createEventoDto.id_estado },
      genero: { id_genero: createEventoDto.id_genero },
      artista: { id: createEventoDto.id_artista },
    });

    const savedEvento = await this.eventoRepository.save(evento);

    // Crear metadatos en MongoDB si hay datos adicionales
    if (this.hasMetadata(createEventoDto)) {
      const metadata = new this.eventoMetadataModel({
        id_evento: savedEvento.id_evento,
        artistas_invitados: createEventoDto.artistas_invitados || [],
        archivos_adjuntos: createEventoDto.archivos_adjuntos || [],
        precio_entrada: createEventoDto.precio_entrada || {},
        requisitos_tecnicos: createEventoDto.requisitos_tecnicos || {},
        sponsors: createEventoDto.sponsors || '',
        politicas_evento: createEventoDto.politicas_evento || {},
      });
      await metadata.save();
    }

    return this.buildEventoResponse(savedEvento);
  }

  async findAll(): Promise<EventoResponse[]> {
    const eventos = await this.eventoRepository.find({
      relations: ['estado', 'genero', 'artista'],
      order: { fecha_evento: 'DESC' }
    });

    const eventosWithMetadata = await Promise.all(
      eventos.map(evento => this.buildEventoResponse(evento))
    );

    return eventosWithMetadata;
  }

  async findOne(id: number): Promise<EventoResponse> {
    const evento = await this.eventoRepository.findOne({
      where: { id_evento: id },
      relations: ['estado', 'genero', 'artista'],
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return this.buildEventoResponse(evento);
  }

  async findByArtista(artistaId: number): Promise<EventoResponse[]> {
    const eventos = await this.eventoRepository.find({
      where: { artista: { id: artistaId } },
      relations: ['estado', 'genero', 'artista'],
      order: { fecha_evento: 'DESC' }
    });

    return Promise.all(eventos.map(evento => this.buildEventoResponse(evento)));
  }

  async findByGenero(generoId: number): Promise<EventoResponse[]> {
    const eventos = await this.eventoRepository.find({
      where: { genero: { id_genero: generoId } },
      relations: ['estado', 'genero', 'artista'],
      order: { fecha_evento: 'DESC' }
    });

    return Promise.all(eventos.map(evento => this.buildEventoResponse(evento)));
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<EventoResponse[]> {
    const eventos = await this.eventoRepository
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.estado', 'estado')
      .leftJoinAndSelect('evento.genero', 'genero')
      .leftJoinAndSelect('evento.artista', 'artista')
      .where('evento.fecha_evento >= :fechaInicio', { fechaInicio })
      .andWhere('evento.fecha_evento <= :fechaFin', { fechaFin })
      .orderBy('evento.fecha_evento', 'ASC')
      .getMany();

    return Promise.all(eventos.map(evento => this.buildEventoResponse(evento)));
  }

  async findUpcoming(): Promise<EventoResponse[]> {
    const hoy = new Date();
    const eventos = await this.eventoRepository
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.estado', 'estado')
      .leftJoinAndSelect('evento.genero', 'genero')
      .leftJoinAndSelect('evento.artista', 'artista')
      .where('evento.fecha_evento >= :hoy', { hoy })
      .orderBy('evento.fecha_evento', 'ASC')
      .getMany();

    return Promise.all(eventos.map(evento => this.buildEventoResponse(evento)));
  }

  async search(query: string): Promise<EventoResponse[]> {
    const eventos = await this.eventoRepository
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.estado', 'estado')
      .leftJoinAndSelect('evento.genero', 'genero')
      .leftJoinAndSelect('evento.artista', 'artista')
      .where('evento.nombre_evento LIKE :query', { query: `%${query}%` })
      .orWhere('evento.descripcion LIKE :query', { query: `%${query}%` })
      .orWhere('evento.ubicacion LIKE :query', { query: `%${query}%` })
      .orWhere('artista.nombre LIKE :query', { query: `%${query}%` })
      .getMany();

    return Promise.all(eventos.map(evento => this.buildEventoResponse(evento)));
  }

  async update(id: number, updateEventoDto: UpdateEventoDto): Promise<EventoResponse> {
    const evento = await this.eventoRepository.findOne({
      where: { id_evento: id }
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    // Verificar nombre único si se actualiza
    if (updateEventoDto.nombre_evento && updateEventoDto.nombre_evento !== evento.nombre_evento) {
      const existing = await this.eventoRepository.findOne({
        where: { 
          nombre_evento: updateEventoDto.nombre_evento,
          fecha_evento: updateEventoDto.fecha_evento ? new Date(updateEventoDto.fecha_evento) : evento.fecha_evento
        }
      });
      if (existing && existing.id_evento !== id) {
        throw new ConflictException('Ya existe un evento con ese nombre en la misma fecha');
      }
    }

    // Validar hora si se actualiza
    if (updateEventoDto.hora_evento && !this.isValidTime(updateEventoDto.hora_evento)) {
      throw new ConflictException('Formato de hora inválido. Use HH:mm');
    }

    // Actualizar datos básicos
    const updateData: any = {};
    if (updateEventoDto.nombre_evento) updateData.nombre_evento = updateEventoDto.nombre_evento;
    if (updateEventoDto.descripcion) updateData.descripcion = updateEventoDto.descripcion;
    if (updateEventoDto.ubicacion) updateData.ubicacion = updateEventoDto.ubicacion;
    if (updateEventoDto.fecha_evento) updateData.fecha_evento = new Date(updateEventoDto.fecha_evento);
    if (updateEventoDto.hora_evento) updateData.hora_evento = updateEventoDto.hora_evento;
    if (updateEventoDto.capacidad) updateData.capacidad = updateEventoDto.capacidad;
    if (updateEventoDto.contacto) updateData.contacto = updateEventoDto.contacto;
    if (updateEventoDto.url_flyer_evento !== undefined) updateData.url_flyer_evento = updateEventoDto.url_flyer_evento;

    // Actualizar relaciones
    if (updateEventoDto.id_estado) {
      updateData.estado = { id_estado: updateEventoDto.id_estado };
    }
    if (updateEventoDto.id_genero) {
      updateData.genero = { id_genero: updateEventoDto.id_genero };
    }
    if (updateEventoDto.id_artista) {
      updateData.artista = { id: updateEventoDto.id_artista };
    }

    if (Object.keys(updateData).length > 0) {
      await this.eventoRepository.update(id, updateData);
    }

    // Actualizar metadatos en MongoDB
    if (this.hasMetadata(updateEventoDto)) {
      const metadataUpdate: any = {};
      
      if (updateEventoDto.artistas_invitados !== undefined) metadataUpdate.artistas_invitados = updateEventoDto.artistas_invitados;
      if (updateEventoDto.archivos_adjuntos !== undefined) metadataUpdate.archivos_adjuntos = updateEventoDto.archivos_adjuntos;
      if (updateEventoDto.precio_entrada !== undefined) metadataUpdate.precio_entrada = updateEventoDto.precio_entrada;
      if (updateEventoDto.requisitos_tecnicos !== undefined) metadataUpdate.requisitos_tecnicos = updateEventoDto.requisitos_tecnicos;
      if (updateEventoDto.sponsors !== undefined) metadataUpdate.sponsors = updateEventoDto.sponsors;
      if (updateEventoDto.politicas_evento !== undefined) metadataUpdate.politicas_evento = updateEventoDto.politicas_evento;

      if (Object.keys(metadataUpdate).length > 0) {
        await this.eventoMetadataModel.findOneAndUpdate(
          { id_evento: id },
          metadataUpdate,
          { upsert: true, new: true }
        );
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const evento = await this.eventoRepository.findOne({
      where: { id_evento: id }
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    // Eliminar metadatos de MongoDB
    await this.eventoMetadataModel.deleteOne({ id_evento: id });

    // Eliminar evento de MySQL
    await this.eventoRepository.remove(evento);
  }

  async updateEstadisticas(id: number, estadisticas: any): Promise<void> {
    await this.eventoMetadataModel.findOneAndUpdate(
      { id_evento: id },
      { estadisticas },
      { upsert: true }
    );
  }

  private async buildEventoResponse(evento: Evento): Promise<EventoResponse> {
    // Obtener metadatos de MongoDB
    const metadata = await this.eventoMetadataModel.findOne({
      id_evento: evento.id_evento
    }).lean();

    return {
      id_evento: evento.id_evento,
      nombre_evento: evento.nombre_evento,
      descripcion: evento.descripcion,
      ubicacion: evento.ubicacion,
      fecha_evento: evento.fecha_evento,
      hora_evento: evento.hora_evento,
      capacidad: evento.capacidad,
      contacto: evento.contacto,
      url_flyer_evento: evento.url_flyer_evento,
      estado: evento.estado,
      genero: evento.genero,
      artista: evento.artista,
      metadatos: metadata ? {
        artistas_invitados: metadata.artistas_invitados,
        archivos_adjuntos: metadata.archivos_adjuntos,
        precio_entrada: metadata.precio_entrada,
        requisitos_tecnicos: metadata.requisitos_tecnicos,
        sponsors: metadata.sponsors,
        politicas_evento: metadata.politicas_evento,
      } : undefined,
    };
  }

  private hasMetadata(dto: CreateEventoDto | UpdateEventoDto): boolean {
    return !!(
      dto.artistas_invitados || 
      dto.archivos_adjuntos || 
      dto.precio_entrada || 
      dto.requisitos_tecnicos || 
      dto.sponsors || 
      dto.politicas_evento
    );
  }

  private isValidTime(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }
}