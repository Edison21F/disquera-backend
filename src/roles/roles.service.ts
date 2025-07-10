
// src/roles/roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../models/entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly roleRepository: Repository<Rol>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Rol> {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Rol[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const role = await this.roleRepository.findOne({
      where: { id_rol: id }
    });
    
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    
    return role;
  }

  async findByName(nombre: string): Promise<Rol> {
    const role = await this.roleRepository.findOne({
      where: { nombre_rol: nombre }
    });
    if (!role) {
      throw new NotFoundException(`Rol con nombre ${nombre} no encontrado`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Rol> {
    await this.findOne(id); // Verifica que existe
    
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

 // Método para inicializar roles por defecto
async initializeDefaultRoles(): Promise<void> {
  const defaultRoles = [
    { nombre_rol: 'Admin', description: 'Administrador del sistema' },
    { nombre_rol: 'Manager', description: 'Manager de artistas' },
    { nombre_rol: 'Usuario', description: 'Usuario final' },
    { nombre_rol: 'Artista', description: 'Artista registrado' }
  ];

  for (const roleData of defaultRoles) {
    const existingRole = await this.roleRepository.findOne({
      where: { nombre_rol: roleData.nombre_rol }
    });
    
    if (!existingRole) {
      await this.create(roleData);
    }
  }
}

}
