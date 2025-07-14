import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero } from '../models/entities/generos.entity';
import { CreateGeneroDto } from '../dto/create-genero.dto';
import { UpdateGeneroDto } from '../dto/update-genero.dto';

@Injectable()
export class GenerosService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  async create(createGeneroDto: CreateGeneroDto): Promise<Genero> {
    // Verificar si el género ya existe
    const existingGenero = await this.findByName(createGeneroDto.nombre_genero);
    if (existingGenero) {
      throw new ConflictException('El género ya existe');
    }

    const genero = this.generoRepository.create(createGeneroDto);
    return await this.generoRepository.save(genero);
  }

  async findAll(): Promise<Genero[]> {
    return await this.generoRepository.find({
      order: { nombre_genero: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Genero> {
    const genero = await this.generoRepository.findOne({
      where: { id_genero: id }
    });
    
    if (!genero) {
      throw new NotFoundException(`Género con ID ${id} no encontrado`);
    }
    
    return genero;
  }

  async findByName(nombreGenero: string): Promise<Genero | null> {
    return await this.generoRepository.findOne({
      where: { nombre_genero: nombreGenero }
    });
  }
  async update(id: number, updateGeneroDto: UpdateGeneroDto): Promise<Genero> {
    const genero = await this.findOne(id);
    
    // Verificar que no exista otro género con el mismo nombre
    if (updateGeneroDto.nombre_genero) {
      const existing = await this.findByName(updateGeneroDto.nombre_genero);
      if (existing && existing.id_genero !== id) {
        throw new ConflictException('Ya existe un género con ese nombre');
      }
    }

    Object.assign(genero, updateGeneroDto);
    return await this.generoRepository.save(genero);
  }

  async remove(id: number): Promise<void> {
    const genero = await this.findOne(id);
    await this.generoRepository.remove(genero);
  }

  // Método para inicializar géneros por defecto
  async initializeDefaultGeneros(): Promise<void> {
    const defaultGeneros = [
      'Rock',
      'Pop',
      'Jazz',
      'Blues',
      'Classical',
      'Electronic',
      'Hip Hop',
      'Reggae',
      'Country',
      'Folk',
      'R&B',
      'Punk',
      'Metal',
      'Indie',
      'Alternative',
      'Reggaeton',
      'Salsa',
      'Cumbia',
      'Bachata',
      'Merengue'
    ];

    for (const nombreGenero of defaultGeneros) {
      const existingGenero = await this.findByName(nombreGenero);
      if (!existingGenero) {
        await this.create({ nombre_genero: nombreGenero });
      }
    }
  }
}
