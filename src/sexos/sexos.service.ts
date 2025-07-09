import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sexo } from '../models/entities/sexo.entity';
import { CreateSexoDto } from './dto/create-sexo.dto';
import { UpdateSexoDto } from './dto/update-sexo.dto';

@Injectable()
export class SexosService {
  constructor(
    @InjectRepository(Sexo)
    private readonly sexoRepository: Repository<Sexo>,
  ) {}

  async create(createSexoDto: CreateSexoDto): Promise<Sexo> {
    // Verificar si ya existe
    const existing = await this.findByDescription(createSexoDto.descripcion);
    if (existing) {
      throw new ConflictException('La opción de género ya existe');
    }

    const sexo = this.sexoRepository.create(createSexoDto);
    return await this.sexoRepository.save(sexo);
  }

  async findAll(): Promise<Sexo[]> {
    return await this.sexoRepository.find({
      order: { descripcion: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Sexo> {
    const sexo = await this.sexoRepository.findOne({
      where: { id_sexo: id }
    });
    
    if (!sexo) {
      throw new NotFoundException(`Opción de género con ID ${id} no encontrada`);
    }
    
    return sexo;
  }

  async findByDescription(descripcion: string): Promise<Sexo | null> {
    return await this.sexoRepository.findOne({
      where: { descripcion }
    });
  }

  async update(id: number, updateSexoDto: UpdateSexoDto): Promise<Sexo> {
    const sexo = await this.findOne(id);
    
    // Verificar que no exista otra opción con la misma descripción
    if (updateSexoDto.descripcion) {
      const existing = await this.findByDescription(updateSexoDto.descripcion);
      if (existing && existing.id_sexo !== id) {
        throw new ConflictException('Ya existe una opción con esa descripción');
      }
    }

    Object.assign(sexo, updateSexoDto);
    return await this.sexoRepository.save(sexo);
  }

  async remove(id: number): Promise<void> {
    const sexo = await this.findOne(id);
    await this.sexoRepository.remove(sexo);
  }

  // Método para inicializar opciones por defecto
  async initializeDefaultOptions(): Promise<void> {
    const defaultOptions = [
      'Masculino',
      'Femenino',
      'No binario',
      'Prefiero no decirlo',
      'Otro'
    ];

    for (const descripcion of defaultOptions) {
      const existing = await this.findByDescription(descripcion);
      if (!existing) {
        await this.create({ descripcion });
      }
    }
  }
}