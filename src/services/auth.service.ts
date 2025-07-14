import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { EstadosService } from './estados.service';
import { RolesService } from './roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly estadosService: EstadosService,
    private readonly rolesService: RolesService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);
    if (user) { 
      const { contrasena, ...result } = user;
      return result;  
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
  console.log('[LOGIN] Intento de login:', loginDto.correo);

  const user = await this.usersService.validateUser(loginDto.correo, loginDto.contrasena);

  if (!user) {
    console.warn('[LOGIN] Credenciales inválidas para:', loginDto.correo);
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Si pasa, continúa
  console.log('[LOGIN] Usuario autenticado:', user.correo);

  const payload: JwtPayload = {
    sub: user.id_usuario,
    email: user.correo,
    role: user.rol?.nombre_rol || 'Usuario',
  };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol?.nombre_rol || 'Usuario',
    },
  };
}


  async register(registerDto: RegisterDto): Promise<AuthResponse> {
  try {
    // Verificar si existen estados en la BD
    const estadoActivo = await this.getDefaultEstado();
    const rolUsuario = await this.getDefaultRol();

    const newUser = await this.usersService.create({
      nombre: registerDto.nombre,
      apellido: registerDto.apellido,
      correo: registerDto.correo,
      contrasena: registerDto.contrasena,
      profesion: registerDto.profesion,
      id_rol: rolUsuario.id_rol,
      id_estado: estadoActivo.id_estado, // Usar estado verificado
    });

    const payload: JwtPayload = {
      sub: newUser.id_usuario,
      email: newUser.correo,
      role: newUser.rol?.nombre_rol || 'Usuario',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id_usuario: newUser.id_usuario,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        correo: newUser.correo,
        rol: newUser.rol?.nombre_rol || 'Usuario',
      },
    };
  } catch (error) {
    if (error instanceof ConflictException) {
      throw error;
    }
    console.error('Error en registro:', error);
    throw new Error('Error al registrar usuario');
  }
}

private async getDefaultEstado() {
  // Inyectar EstadosService en el constructor
  try {
    return await this.estadosService.findByDescription('Activo');
  } catch {
    // Si no existe, crear estado por defecto
    return await this.estadosService.create({ descripcion: 'Activo' });
  }
}

private async getDefaultRol() {
  // Inyectar RolesService en el constructor
  try {
    return await this.rolesService.findByName('Usuario');
  } catch {
    // Si no existe, crear rol por defecto
    return await this.rolesService.create({ 
      nombre_rol: 'Usuario', 
      description: 'Usuario estándar' 
    });
  }
}

  async refreshToken(user: any): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id_usuario,
      email: user.correo,
      role: user.rol?.nombre_rol || 'Usuario',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol?.nombre_rol || 'Usuario',
      },
    };
  }

  async getProfile(userId: number) {
    return await this.usersService.findOne(userId);
  }
}