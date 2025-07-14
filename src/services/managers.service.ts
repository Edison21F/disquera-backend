import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Manager } from '../models/entities/managers.entity';
import { ManagerMetadata } from '../models/schemas/manager-metadata.schema';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { UpdateManagerDto } from '../dto/update-manager.dto';
import { ManagerResponse } from '../interfaces/manager-response.interface';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    @InjectModel('ManagerMetadata')
    private readonly managerMetadataModel: Model<ManagerMetadata>,
  ) {}

  async create(createManagerDto: CreateManagerDto): Promise<ManagerResponse> {
    // Verificar si ya existe un manager con el mismo nombre artístico
    const existing = await this.managerRepository.findOne({
      where: { nombre_artistico: createManagerDto.nombre_artistico }
    });

    if (existing) {
      throw new ConflictException('Ya existe un manager con ese nombre artístico');
    }

    // Crear manager en MySQL
    const manager = this.managerRepository.create({
      nombre_artistico: createManagerDto.nombre_artistico,
      fecha_registro: new Date(),
      sexo: { id_sexo: createManagerDto.id_sexo },
      estado: createManagerDto.id_estado ? { id_estado: createManagerDto.id_estado } : undefined,
    });

    const savedManager = await this.managerRepository.save(manager);

    // Crear metadatos en MongoDB si hay datos adicionales
    if (this.hasMetadata(createManagerDto)) {
      const metadata = new this.managerMetadataModel({
        id_manager: savedManager.id_manager,
        biografia: createManagerDto.biografia || '',
        url_imagen_perfil: createManagerDto.url_imagen_perfil || '',
        experiencia: createManagerDto.experiencia || '',
        redes_sociales: createManagerDto.redes_sociales || {},
        notas_adicionales: createManagerDto.notas_adicionales || '',
        artistas_gestionados: createManagerDto.artistas_gestionados || [],
        contacto_profesional: createManagerDto.contacto_profesional || {},
        especialidades: createManagerDto.especialidades || {},
      });
      await metadata.save();
    }

    return this.buildManagerResponse(savedManager);
  }

  async findAll(): Promise<ManagerResponse[]> {
    const managers = await this.managerRepository.find({
      relations: ['sexo', 'estado'],
      order: { fecha_registro: 'DESC' }
    });

    const managersWithMetadata = await Promise.all(
      managers.map(manager => this.buildManagerResponse(manager))
    );

    return managersWithMetadata;
  }

  async findOne(id: number): Promise<ManagerResponse> {
    const manager = await this.managerRepository.findOne({
      where: { id_manager: id },
      relations: ['sexo', 'estado'],
    });

    if (!manager) {
      throw new NotFoundException(`Manager con ID ${id} no encontrado`);
    }

    return this.buildManagerResponse(manager);
  }

  async findByName(nombreArtistico: string): Promise<ManagerResponse | null> {
    const manager = await this.managerRepository.findOne({
      where: { nombre_artistico: nombreArtistico },
      relations: ['sexo', 'estado'],
    });

    if (!manager) {
      return null;
    }

    return this.buildManagerResponse(manager);
  }

  async findByGenre(genero: string): Promise<ManagerResponse[]> {
    // Buscar en MongoDB por especialidades
    const metadatas = await this.managerMetadataModel.find({
      'especialidades.generos_musicales': { $in: [genero] }
    }).lean();

    const managerIds = metadatas.map(meta => meta.id_manager);

    if (managerIds.length === 0) {
      return [];
    }

    const managers = await this.managerRepository.find({
      where: { id_manager: { $in: managerIds } as any },
      relations: ['sexo', 'estado'],
    });

    return Promise.all(managers.map(manager => this.buildManagerResponse(manager)));
  }

  async search(query: string): Promise<ManagerResponse[]> {
    // Buscar en MySQL
    const managers = await this.managerRepository
      .createQueryBuilder('manager')
      .leftJoinAndSelect('manager.sexo', 'sexo')
      .leftJoinAndSelect('manager.estado', 'estado')
      .where('manager.nombre_artistico LIKE :query', { query: `%${query}%` })
      .getMany();

    // También buscar en MongoDB por biografía, experiencia, etc.
    const metadatas = await this.managerMetadataModel.find({
      $or: [
        { biografia: { $regex: query, $options: 'i' } },
        { experiencia: { $regex: query, $options: 'i' } },
        { 'especialidades.generos_musicales': { $in: [new RegExp(query, 'i')] } },
        { 'especialidades.servicios_ofrecidos': { $in: [new RegExp(query, 'i')] } }
      ]
    }).lean();

    const metadataManagerIds = metadatas.map(meta => meta.id_manager);
    
    // Combinar managers encontrados en MySQL con los de MongoDB
    const additionalManagerIds = metadataManagerIds.filter(id => 
      !managers.find(m => m.id_manager === id)
    );

    if (additionalManagerIds.length > 0) {
      const additionalManagers = await this.managerRepository.find({
        where: additionalManagerIds.map(id => ({ id_manager: id })),
        relations: ['sexo', 'estado'],
      });
      managers.push(...additionalManagers);
    }

    return Promise.all(managers.map(manager => this.buildManagerResponse(manager)));
  }

  async findActive(): Promise<ManagerResponse[]> {
    const managers = await this.managerRepository.find({
      where: { estado: { descripcion: 'Activo' } },
      relations: ['sexo', 'estado'],
      order: { nombre_artistico: 'ASC' }
    });

    return Promise.all(managers.map(manager => this.buildManagerResponse(manager)));
  }

  async update(id: number, updateManagerDto: UpdateManagerDto): Promise<ManagerResponse> {
    const manager = await this.managerRepository.findOne({
      where: { id_manager: id }
    });

    if (!manager) {
      throw new NotFoundException(`Manager con ID ${id} no encontrado`);
    }

    // Verificar nombre único si se actualiza
    if (updateManagerDto.nombre_artistico && updateManagerDto.nombre_artistico !== manager.nombre_artistico) {
      const existing = await this.findByName(updateManagerDto.nombre_artistico);
      if (existing) {
        throw new ConflictException('Ya existe un manager con ese nombre artístico');
      }
    }

    // Actualizar datos básicos
    const updateData: any = {};
    if (updateManagerDto.nombre_artistico) updateData.nombre_artistico = updateManagerDto.nombre_artistico;

    // Actualizar relaciones
    if (updateManagerDto.id_sexo) {
      updateData.sexo = { id_sexo: updateManagerDto.id_sexo };
    }
    if (updateManagerDto.id_estado !== undefined) {
      updateData.estado = updateManagerDto.id_estado ? { id_estado: updateManagerDto.id_estado } : null;
    }

    if (Object.keys(updateData).length > 0) {
      await this.managerRepository.update(id, updateData);
    }

    // Actualizar metadatos en MongoDB
    if (this.hasMetadata(updateManagerDto)) {
      const metadataUpdate: any = {};
      
      if (updateManagerDto.biografia !== undefined) metadataUpdate.biografia = updateManagerDto.biografia;
      if (updateManagerDto.url_imagen_perfil !== undefined) metadataUpdate.url_imagen_perfil = updateManagerDto.url_imagen_perfil;
      if (updateManagerDto.experiencia !== undefined) metadataUpdate.experiencia = updateManagerDto.experiencia;
      if (updateManagerDto.redes_sociales !== undefined) metadataUpdate.redes_sociales = updateManagerDto.redes_sociales;
      if (updateManagerDto.notas_adicionales !== undefined) metadataUpdate.notas_adicionales = updateManagerDto.notas_adicionales;
      if (updateManagerDto.artistas_gestionados !== undefined) metadataUpdate.artistas_gestionados = updateManagerDto.artistas_gestionados;
      if (updateManagerDto.contacto_profesional !== undefined) metadataUpdate.contacto_profesional = updateManagerDto.contacto_profesional;
      if (updateManagerDto.especialidades !== undefined) metadataUpdate.especialidades = updateManagerDto.especialidades;

      if (Object.keys(metadataUpdate).length > 0) {
        await this.managerMetadataModel.findOneAndUpdate(
          { id_manager: id },
          metadataUpdate,
          { upsert: true, new: true }
        );
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const manager = await this.managerRepository.findOne({
      where: { id_manager: id }
    });

    if (!manager) {
      throw new NotFoundException(`Manager con ID ${id} no encontrado`);
    }

    // Eliminar metadatos de MongoDB
    await this.managerMetadataModel.deleteOne({ id_manager: id });

    // Eliminar manager de MySQL
    await this.managerRepository.remove(manager);
  }

  async updateEstadisticas(id: number, estadisticas: any): Promise<void> {
    await this.managerMetadataModel.findOneAndUpdate(
      { id_manager: id },
      { estadisticas },
      { upsert: true }
    );
  }

  async addCertificacion(id: number, certificacion: any): Promise<void> {
    await this.managerMetadataModel.findOneAndUpdate(
      { id_manager: id },
      { $push: { certificaciones: certificacion } },
      { upsert: true }
    );
  }

  async removeCertificacion(id: number, certificacionId: string): Promise<void> {
    await this.managerMetadataModel.findOneAndUpdate(
      { id_manager: id },
      { $pull: { certificaciones: { _id: certificacionId } } }
    );
  }

  async getManagersByService(servicio: string): Promise<ManagerResponse[]> {
    const metadatas = await this.managerMetadataModel.find({
      'especialidades.servicios_ofrecidos': { $in: [servicio] }
    }).lean();

    const managerIds = metadatas.map(meta => meta.id_manager);

    if (managerIds.length === 0) {
      return [];
    }

    const managers = await this.managerRepository.find({
      where: managerIds.map(id => ({ id_manager: id })),
      relations: ['sexo', 'estado'],
    });

    return Promise.all(managers.map(manager => this.buildManagerResponse(manager)));
  }

  private async buildManagerResponse(manager: Manager): Promise<ManagerResponse> {
    // Obtener metadatos de MongoDB
    const metadata = await this.managerMetadataModel.findOne({
      id_manager: manager.id_manager
    }).lean();

    return {
      id_manager: manager.id_manager,
      nombre_artistico: manager.nombre_artistico,
      fecha_registro: manager.fecha_registro,
      sexo: manager.sexo,
      estado: manager.estado,
      perfil: metadata ? {
        biografia: metadata.biografia,
        url_imagen_perfil: metadata.url_imagen_perfil,
        experiencia: metadata.experiencia,
        redes_sociales: metadata.redes_sociales,
        notas_adicionales: metadata.notas_adicionales,
        artistas_gestionados: metadata.artistas_gestionados,
        contacto_profesional: metadata.contacto_profesional,
        especialidades: metadata.especialidades,
      } : undefined,
    };
  }

  private hasMetadata(dto: CreateManagerDto | UpdateManagerDto): boolean {
    return !!(
      dto.biografia || 
      dto.url_imagen_perfil || 
      dto.experiencia || 
      dto.redes_sociales || 
      dto.notas_adicionales || 
      dto.artistas_gestionados || 
      dto.contacto_profesional || 
      dto.especialidades
    );
  }
}
