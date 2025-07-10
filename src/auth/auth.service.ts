import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
    const user = await this.usersService.validateUser(loginDto.correo, loginDto.contrasena);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

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
      const newUser = await this.usersService.create({
        nombre: registerDto.nombre,
        apellido: registerDto.apellido,
        correo: registerDto.correo,
        contrasena: registerDto.contrasena,
        profesion: registerDto.profesion,
        id_rol: 3, // Rol "Usuario" por defecto
        id_estado: 1, // Estado "Activo" por defecto
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
      throw new Error('Error al registrar usuario');
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