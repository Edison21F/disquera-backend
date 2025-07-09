import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from '../models/entities/paises.entity';
import { CreatePaisDto } from './dto/create-paise.dto';
import { UpdatePaisDto } from './dto/update-paise.dto';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Pais)
    private readonly paisRepository: Repository<Pais>,
  ) {}

  async create(createPaisDto: CreatePaisDto): Promise<Pais> {
    // Verificar si el país ya existe
    const existingPais = await this.findByName(createPaisDto.nombre_pais);
    if (existingPais) {
      throw new ConflictException('El país ya existe');
    }

    const pais = this.paisRepository.create(createPaisDto);
    return await this.paisRepository.save(pais);
  }

  async findAll(): Promise<Pais[]> {
    return await this.paisRepository.find({
      order: { nombre_pais: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Pais> {
    const pais = await this.paisRepository.findOne({
      where: { id_pais: id }
    });

    if (!pais) {
      throw new NotFoundException(`País con ID ${id} no encontrado`);
    }

    return pais;
  }

  async findByName(nombrePais: string): Promise<Pais | null> {
    return await this.paisRepository.findOne({
      where: { nombre_pais: nombrePais }
    });
  }

  async update(id: number, updatePaisDto: UpdatePaisDto): Promise<Pais> {
    const pais = await this.findOne(id);
    
    // Verificar que no exista otro país con el mismo nombre
    if (updatePaisDto.nombre_pais) {
      const existing = await this.findByName(updatePaisDto.nombre_pais);
      if (existing && existing.id_pais !== id) {
        throw new ConflictException('Ya existe un país con ese nombre');
      }
    }

    Object.assign(pais, updatePaisDto);
    return await this.paisRepository.save(pais);
  }

  async remove(id: number): Promise<void> {
    const pais = await this.findOne(id);
    await this.paisRepository.remove(pais);
  }

  // Método para inicializar países por defecto (enfoque en Latinoamérica)
  async initializeDefaultCountries(): Promise<void> {
    const defaultCountries = [
      'Argentina',
      'Bolivia',
      'Brasil',
      'Chile',
      'Colombia',
      'Costa Rica',
      'Cuba',
      'Ecuador',
      'El Salvador',
      'Guatemala',
      'Honduras',
      'México',
      'Nicaragua',
      'Panamá',
      'Paraguay',
      'Perú',
      'República Dominicana',
      'Uruguay',
      'Venezuela',
      'España',
      'Estados Unidos',
      'Canadá',
      'Reino Unido',
      'Francia',
      'Italia',
      'Alemania',
      'Portugal',
      'Jamaica',
      'Puerto Rico'
    ];

    for (const nombrePais of defaultCountries) {
      const existingPais = await this.findByName(nombrePais);
      if (!existingPais) {
        await this.create({ nombre_pais: nombrePais });
      }
    }
  }
}