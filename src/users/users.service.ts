import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../models/entities/users.entity';
import { PerfilUsuario } from '../models/schemas/userProfile.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/user-profile.dto';
import { UserResponse } from './interfaces/user-response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectModel('PerfilUsuario')
    private readonly perfilUsuarioModel: Model<PerfilUsuario>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { correo: createUserDto.correo }
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hash de la contrasena
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, 10);

    // Crear usuario en MySQL
    const user = this.userRepository.create({
      nombre: createUserDto.nombre,
      apellido: createUserDto.apellido,
      correo: createUserDto.correo,
      contrasena: hashedPassword,
      fecha_registro: new Date(),
    });

    // Guardar el usuario
    const savedUser = await this.userRepository.save(user);

    // Ahora actualizar las relaciones si existen
    if (createUserDto.id_estado || createUserDto.id_rol || createUserDto.id_sexo || createUserDto.id_pais) {
      const updateData: any = {};
      
      if (createUserDto.id_estado) {
        updateData.estado = { id_estado: createUserDto.id_estado };
      }
      if (createUserDto.id_rol) {
        updateData.rol = { id_rol: createUserDto.id_rol };
      }
      if (createUserDto.id_sexo) {
        updateData.sexo = { id_sexo: createUserDto.id_sexo };
      }
      if (createUserDto.id_pais) {
        updateData.pais = { id_pais: createUserDto.id_pais };
      }

      await this.userRepository.update(savedUser.id_usuario, updateData);
    }

    // Crear perfil extendido en MongoDB si hay datos adicionales
    const perfilData = {
      profesion: createUserDto.profesion,
      foto_perfil_url: createUserDto.foto_perfil_url,
      redes_sociales: createUserDto.redes_sociales,
      temas_favoritos: createUserDto.temas_favoritos,
    };

    if (Object.values(perfilData).some(value => value !== undefined)) {
      const perfil = new this.perfilUsuarioModel({
        id_usuario: savedUser.id_usuario,
        ...perfilData,
      });
      await perfil.save();
    }

    return this.buildUserResponse(savedUser);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      relations: ['estado', 'rol', 'sexo', 'pais'],
    });

    const userResponses = await Promise.all(
      users.map(user => this.buildUserResponse(user))
    );

    return userResponses;
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: id },
      relations: ['estado', 'rol', 'sexo', 'pais'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.buildUserResponse(user);
  }

  async findByEmail(email: string): Promise<Usuario> {
    const user = await this.userRepository.findOne({
      where: { correo: email },
      relations: ['estado', 'rol', 'sexo', 'pais'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con correo ${email} no encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: id }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Preparar datos para actualizar
    const updateData: any = {};

    // Datos básicos
    if (updateUserDto.nombre !== undefined) updateData.nombre = updateUserDto.nombre;
    if (updateUserDto.apellido !== undefined) updateData.apellido = updateUserDto.apellido;
    if (updateUserDto.correo !== undefined) updateData.correo = updateUserDto.correo;

    // Si se actualiza la contrasena, hashearla
    if (updateUserDto.contrasena) {
      updateData.contrasena = await bcrypt.hash(updateUserDto.contrasena, 10);
    }

    // Relaciones - Solo actualizar si se proporcionan
    if (updateUserDto.id_estado !== undefined) {
      updateData.estado = { id_estado: updateUserDto.id_estado };
    }
    if (updateUserDto.id_rol !== undefined) {
      updateData.rol = { id_rol: updateUserDto.id_rol };
    }
    if (updateUserDto.id_sexo !== undefined) {
      updateData.sexo = updateUserDto.id_sexo ? { id_sexo: updateUserDto.id_sexo } : null;
    }
    if (updateUserDto.id_pais !== undefined) {
      updateData.pais = updateUserDto.id_pais ? { id_pais: updateUserDto.id_pais } : null;
    }

    // Actualizar datos en MySQL solo si hay cambios
    if (Object.keys(updateData).length > 0) {
      await this.userRepository.update(id, updateData);
    }

    // Actualizar perfil en MongoDB si hay datos
    const perfilData: any = {};
    if (updateUserDto.profesion !== undefined) perfilData.profesion = updateUserDto.profesion;
    if (updateUserDto.foto_perfil_url !== undefined) perfilData.foto_perfil_url = updateUserDto.foto_perfil_url;
    if (updateUserDto.redes_sociales !== undefined) perfilData.redes_sociales = updateUserDto.redes_sociales;
    if (updateUserDto.temas_favoritos !== undefined) perfilData.temas_favoritos = updateUserDto.temas_favoritos;

    if (Object.keys(perfilData).length > 0) {
      await this.perfilUsuarioModel.findOneAndUpdate(
        { id_usuario: id },
        perfilData,
        { upsert: true, new: true }
      );
    }

    return this.findOne(id);
  }

  async updateProfile(id: number, updateProfileDto: UpdateUserProfileDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: id }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const perfil = await this.perfilUsuarioModel.findOneAndUpdate(
      { id_usuario: id },
      updateProfileDto,
      { upsert: true, new: true }
    );

    return perfil;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: id }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Eliminar perfil de MongoDB
    await this.perfilUsuarioModel.deleteOne({ id_usuario: id });

    // Eliminar usuario de MySQL
    await this.userRepository.remove(user);
  }

  private async buildUserResponse(user: Usuario): Promise<UserResponse> {
    // Obtener perfil de MongoDB
    const perfil = await this.perfilUsuarioModel.findOne({
      id_usuario: user.id_usuario
    }).lean();

    return {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      fecha_registro: user.fecha_registro,
      estado: user.estado,
      rol: user.rol,
      sexo: user.sexo,
      pais: user.pais,
      perfil: perfil ? {
        profesion: perfil.profesion,
        foto_perfil_url: perfil.foto_perfil_url,
        redes_sociales: perfil.redes_sociales,
        temas_favoritos: perfil.temas_favoritos,
      } : undefined,
    };
  }

  async validateUser(email: string, password: string): Promise<Usuario | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.contrasena)) {
      return user;
    }
    return null;
  }
}
