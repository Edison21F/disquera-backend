import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Comentario } from '../models/entities/comentarios.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { FilterComentariosDto } from './dto/filter-comentarios.dto';
import { ComentarioResponse, ComentariosPaginatedResponse, ComentariosStatsResponse } from './interfaces/comentario-response.interface';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
  ) {}

  async create(createComentarioDto: CreateComentarioDto): Promise<ComentarioResponse> {
    // Verificar que el contenido no esté vacío después de limpiar espacios
    const contenidoLimpio = createComentarioDto.comentario.trim();
    if (!contenidoLimpio) {
      throw new BadRequestException('El comentario no puede estar vacío');
    }

    const comentario = this.comentarioRepository.create({
      usuario: { id_usuario: createComentarioDto.id_usuario },
      id_producto: createComentarioDto.id_producto,
      comentario: contenidoLimpio,
      fecha: new Date(),
    });

    const saved = await this.comentarioRepository.save(comentario);
    return this.buildComentarioResponse(saved);
  }

  async findAll(filterDto?: FilterComentariosDto): Promise<ComentariosPaginatedResponse> {
    const queryBuilder = this.comentarioRepository
      .createQueryBuilder('comentario')
      .leftJoinAndSelect('comentario.usuario', 'usuario');

    // Aplicar filtros
    if (filterDto?.id_usuario) {
      queryBuilder.andWhere('comentario.usuario = :userId', { userId: filterDto.id_usuario });
    }

    if (filterDto?.id_producto) {
      queryBuilder.andWhere('comentario.id_producto = :productId', { productId: filterDto.id_producto });
    }

    if (filterDto?.fecha_desde && filterDto?.fecha_hasta) {
      queryBuilder.andWhere('comentario.fecha BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filterDto.fecha_desde,
        fechaHasta: filterDto.fecha_hasta,
      });
    }

    // Ordenamiento
    const orden = filterDto?.orden_fecha || 'desc';
    queryBuilder.orderBy('comentario.fecha', orden.toUpperCase() as 'ASC' | 'DESC');

    // Paginación
    const page = filterDto?.page || 1;
    const limit = filterDto?.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [comentarios, total] = await queryBuilder.getManyAndCount();

    return {
      comentarios: comentarios.map(comentario => this.buildComentarioResponse(comentario)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<ComentarioResponse> {
    const comentario = await this.comentarioRepository.findOne({
      where: { id_comentario: id },
      relations: ['usuario'],
    });

    if (!comentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }

    return this.buildComentarioResponse(comentario);
  }

  async findByProduct(productId: number, page: number = 1, limit: number = 10): Promise<ComentariosPaginatedResponse> {
    const filterDto: FilterComentariosDto = {
      id_producto: productId,
      page,
      limit,
      orden_fecha: 'desc'
    };

    return this.findAll(filterDto);
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<ComentariosPaginatedResponse> {
    const filterDto: FilterComentariosDto = {
      id_usuario: userId,
      page,
      limit,
      orden_fecha: 'desc'
    };

    return this.findAll(filterDto);
  }

  async findRecent(limit: number = 10): Promise<ComentarioResponse[]> {
    const comentarios = await this.comentarioRepository.find({
      relations: ['usuario'],
      order: { fecha: 'DESC' },
      take: limit,
    });

    return comentarios.map(comentario => this.buildComentarioResponse(comentario));
  }

  async searchComments(query: string, page: number = 1, limit: number = 10): Promise<ComentariosPaginatedResponse> {
    const queryBuilder = this.comentarioRepository
      .createQueryBuilder('comentario')
      .leftJoinAndSelect('comentario.usuario', 'usuario')
      .where('comentario.comentario LIKE :query', { query: `%${query}%` })
      .orWhere('usuario.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('usuario.apellido LIKE :query', { query: `%${query}%` })
      .orderBy('comentario.fecha', 'DESC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [comentarios, total] = await queryBuilder.getManyAndCount();

    return {
      comentarios: comentarios.map(comentario => this.buildComentarioResponse(comentario)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getCommentStats(): Promise<ComentariosStatsResponse> {
    // Total de comentarios
    const total_comentarios = await this.comentarioRepository.count();

    // Comentarios por mes (últimos 12 meses)
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - 12);

    const comentarios_por_mes = await this.comentarioRepository
      .createQueryBuilder('comentario')
      .select("DATE_FORMAT(comentario.fecha, '%Y-%m')", 'mes')
      .addSelect('COUNT(*)', 'cantidad')
      .where('comentario.fecha >= :fechaLimite', { fechaLimite })
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();

    // Usuarios más activos
    const usuarios_mas_activos = await this.comentarioRepository
      .createQueryBuilder('comentario')
      .leftJoin('comentario.usuario', 'usuario')
      .select('usuario.id_usuario', 'id_usuario')
      .addSelect('usuario.nombre', 'nombre')
      .addSelect('usuario.apellido', 'apellido')
      .addSelect('COUNT(*)', 'total_comentarios')
      .groupBy('usuario.id_usuario')
      .orderBy('total_comentarios', 'DESC')
      .limit(10)
      .getRawMany();

    // Productos más comentados
    const productos_mas_comentados = await this.comentarioRepository
      .createQueryBuilder('comentario')
      .select('comentario.id_producto', 'id_producto')
      .addSelect('COUNT(*)', 'total_comentarios')
      .groupBy('comentario.id_producto')
      .orderBy('total_comentarios', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      total_comentarios,
      comentarios_por_mes,
      usuarios_mas_activos,
      productos_mas_comentados,
    };
  }

  async getProductCommentCount(productId: number): Promise<number> {
    return await this.comentarioRepository.count({
      where: { id_producto: productId }
    });
  }

  async getUserCommentCount(userId: number): Promise<number> {
    return await this.comentarioRepository.count({
      where: { usuario: { id_usuario: userId } }
    });
  }

  async update(id: number, updateComentarioDto: UpdateComentarioDto, currentUserId?: number): Promise<ComentarioResponse> {
    const comentario = await this.comentarioRepository.findOne({
      where: { id_comentario: id },
      relations: ['usuario']
    });

    if (!comentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }

    // Verificar que el usuario actual sea el autor del comentario
    if (currentUserId && comentario.usuario.id_usuario !== currentUserId) {
      throw new ForbiddenException('Solo puedes editar tus propios comentarios');
    }

    // Verificar que el contenido no esté vacío
    if (updateComentarioDto.comentario) {
      const contenidoLimpio = updateComentarioDto.comentario.trim();
      if (!contenidoLimpio) {
        throw new BadRequestException('El comentario no puede estar vacío');
      }
      comentario.comentario = contenidoLimpio;
      // Podrías agregar un campo fecha_editado a la entidad
    }

    const updated = await this.comentarioRepository.save(comentario);
    return this.buildComentarioResponse(updated);
  }

  async remove(id: number, currentUserId?: number): Promise<void> {
    const comentario = await this.comentarioRepository.findOne({
      where: { id_comentario: id },
      relations: ['usuario']
    });

    if (!comentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }

    // Verificar permisos (el autor o un admin pueden eliminar)
    if (currentUserId && comentario.usuario.id_usuario !== currentUserId) {
      // Aquí podrías verificar si es admin
      throw new ForbiddenException('Solo puedes eliminar tus propios comentarios');
    }

    await this.comentarioRepository.remove(comentario);
  }

  async removeByProduct(productId: number): Promise<void> {
    const comentarios = await this.comentarioRepository.find({
      where: { id_producto: productId }
    });

    if (comentarios.length > 0) {
      await this.comentarioRepository.remove(comentarios);
    }
  }

  async removeByUser(userId: number): Promise<void> {
    const comentarios = await this.comentarioRepository.find({
      where: { usuario: { id_usuario: userId } }
    });

    if (comentarios.length > 0) {
      await this.comentarioRepository.remove(comentarios);
    }
  }

  private buildComentarioResponse(comentario: Comentario, currentUserId?: number): ComentarioResponse {
    return {
      id_comentario: comentario.id_comentario,
      id_producto: comentario.id_producto,
      comentario: comentario.comentario,
      fecha: comentario.fecha,
      usuario: comentario.usuario ? {
        id_usuario: comentario.usuario.id_usuario,
        nombre: comentario.usuario.nombre,
        apellido: comentario.usuario.apellido,
        // foto_perfil se completaría con datos del perfil de usuario
      } : undefined,
      es_autor: currentUserId ? comentario.usuario?.id_usuario === currentUserId : undefined,
      // El producto_info se completaría con joins a las tablas correspondientes
    };
  }
}