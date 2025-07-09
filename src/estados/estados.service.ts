import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from '../models/entities/estados.entity';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createEstadoDto: CreateEstadoDto): Promise<Estado> {
    const estado = this.estadoRepository.create(createEstadoDto);
    return await this.estadoRepository.save(estado);
  }

  async findAll(): Promise<Estado[]> {
    return await this.estadoRepository.find();
  }

  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({
      where: { id_estado: id }
    });
    
    if (!estado) {
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    }
    
    return estado;
  }

  async findByDescription(descripcion: string): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({
      where: { descripcion }
    });
    if (!estado) {
      throw new NotFoundException(`Estado con descripción "${descripcion}" no encontrado`);
    }
    return estado;
  }

  async update(id: number, updateEstadoDto: UpdateEstadoDto): Promise<Estado> {
    await this.findOne(id); // Verifica que existe
    
    await this.estadoRepository.update(id, updateEstadoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const estado = await this.findOne(id);
    await this.estadoRepository.remove(estado);
  }

  // Método para inicializar estados por defecto
  async initializeDefaultStates(): Promise<void> {
    const defaultStates = [
      { descripcion: 'Activo' },
      { descripcion: 'Inactivo' },
      { descripcion: 'Pendiente' },
      { descripcion: 'Suspendido' },
      { descripcion: 'Eliminado' },
      { descripcion: 'En Proceso' },
      { descripcion: 'Completado' },
      { descripcion: 'Cancelado' }
    ];

    for (const stateData of defaultStates) {
      const existingState = await this.findByDescription(stateData.descripcion);
      if (!existingState) {
        await this.create(stateData);
      }
    }
  }
}
