import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Resena } from '../models/entities/resenas.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { FilterResenasDto } from './dto/filter-resenas.dto';
import { ResenaResponse, ResenasPaginatedResponse, ProductRatingsSummary, ResenasStatsResponse } from './interfaces/resena-response.interface';

@Injectable()
export class ResenasService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
  ) {}

  async create(createResenaDto: CreateResenaDto): Promise<ResenaResponse> {
    // Verificar si el usuario ya tiene una reseña para este producto
    const existingResena = await this.resenaRepository.findOne({
      where: {
        usuario: { id_usuario: createResenaDto.id_usuario },
        id_producto: createResenaDto.id_producto
      }
    });

    if (existingResena) {
      throw new ConflictException('Ya tienes una reseña para este producto. Puedes editarla si deseas.');
    }

    // Verificar que el contenido no esté vacío después de limpiar espacios
    const contenidoLimpio = createResenaDto.comentario.trim();
    if (!contenidoLimpio) {
      throw new BadRequestException('La reseña no puede estar vacía');
    }

    const resena = this.resenaRepository.create({
      usuario: { id_usuario: createResenaDto.id_usuario },
      id_producto: createResenaDto.id_producto,
      calificacion: createResenaDto.calificacion,
      comentario: contenidoLimpio,
      fecha: new Date(),
    });

    const saved = await this.resenaRepository.save(resena);
    return this.buildResenaResponse(saved);
  }

  async findAll(filterDto?: FilterResenasDto): Promise<ResenasPaginatedResponse> {
    const queryBuilder = this.resenaRepository
      .createQueryBuilder('resena')
      .leftJoinAndSelect('resena.usuario', 'usuario');

    // Aplicar filtros
    if (filterDto?.id_usuario) {
      queryBuilder.andWhere('resena.usuario = :userId', { userId: filterDto.id_usuario });
    }

    if (filterDto?.id_producto) {
      queryBuilder.andWhere('resena.id_producto = :productId', { productId: filterDto.id_producto });
    }

    if (filterDto?.calificacion) {
      queryBuilder.andWhere('resena.calificacion = :calificacion', { calificacion: filterDto.calificacion });
    }

    if (filterDto?.calificacion_minima && filterDto?.calificacion_maxima) {
      queryBuilder.andWhere('resena.calificacion BETWEEN :min AND :max', {
        min: filterDto.calificacion_minima,
        max: filterDto.calificacion_maxima,
      });
    } else if (filterDto?.calificacion_minima) {
      queryBuilder.andWhere('resena.calificacion >= :min', { min: filterDto.calificacion_minima });
    } else if (filterDto?.calificacion_maxima) {
      queryBuilder.andWhere('resena.calificacion <= :max', { max: filterDto.calificacion_maxima });
    }

    if (filterDto?.fecha_desde && filterDto?.fecha_hasta) {
      queryBuilder.andWhere('resena.fecha BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filterDto.fecha_desde,
        fechaHasta: filterDto.fecha_hasta,
      });
    }

    // Ordenamiento
    if (filterDto?.orden_calificacion) {
      queryBuilder.addOrderBy('resena.calificacion', filterDto.orden_calificacion.toUpperCase() as 'ASC' | 'DESC');
    }
    
    const orden_fecha = filterDto?.orden_fecha || 'desc';
    queryBuilder.addOrderBy('resena.fecha', orden_fecha.toUpperCase() as 'ASC' | 'DESC');

    // Paginación
    const page = filterDto?.page || 1;
    const limit = filterDto?.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [resenas, total] = await queryBuilder.getManyAndCount();

    // Calcular estadísticas
    const promedio_calificacion = await this.calculateAverageRating(filterDto?.id_producto);
    const distribucion_calificaciones = await this.getCalificacionDistribution(filterDto?.id_producto);

    return {
      resenas: resenas.map(resena => this.buildResenaResponse(resena)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      promedio_calificacion,
      distribucion_calificaciones,
    };
  }

  async findOne(id: number): Promise<ResenaResponse> {
    const resena = await this.resenaRepository.findOne({
      where: { id_resena: id },
      relations: ['usuario'],
    });

    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    return this.buildResenaResponse(resena);
  }

  async findByProduct(productId: number, page: number = 1, limit: number = 10): Promise<ResenasPaginatedResponse> {
    const filterDto: FilterResenasDto = {
      id_producto: productId,
      page,
      limit,
      orden_fecha: 'desc'
    };

    return this.findAll(filterDto);
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<ResenasPaginatedResponse> {
    const filterDto: FilterResenasDto = {
      id_usuario: userId,
      page,
      limit,
      orden_fecha: 'desc'
    };

    return this.findAll(filterDto);
  }

  async getProductRatingsSummary(productId: number): Promise<ProductRatingsSummary> {
    const total_resenas = await this.resenaRepository.count({
      where: { id_producto: productId }
    });

    const promedio_calificacion = await this.calculateAverageRating(productId);
    const distribucion_calificaciones = await this.getCalificacionDistribution(productId);

    // Obtener reseñas recientes
    const resenas_recientes = await this.resenaRepository.find({
      where: { id_producto: productId },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
      take: 5,
    });

    return {
      id_producto: productId,
      total_resenas,
      promedio_calificacion,
      distribucion_calificaciones,
      resenas_recientes: resenas_recientes.map(resena => this.buildResenaResponse(resena)),
    };
  }

  async getTopRatedProducts(limit: number = 10): Promise<any[]> {
    return await this.resenaRepository
      .createQueryBuilder('resena')
      .select('resena.id_producto', 'id_producto')
      .addSelect('AVG(resena.calificacion)', 'promedio_calificacion')
      .addSelect('COUNT(*)', 'total_resenas')
      .groupBy('resena.id_producto')
      .having('COUNT(*) >= 3') // Mínimo 3 reseñas
      .orderBy('promedio_calificacion', 'DESC')
      .addOrderBy('total_resenas', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async searchResenas(query: string, page: number = 1, limit: number = 10): Promise<ResenasPaginatedResponse> {
    const queryBuilder = this.resenaRepository
      .createQueryBuilder('resena')
      .leftJoinAndSelect('resena.usuario', 'usuario')
      .where('resena.comentario LIKE :query', { query: `%${query}%` })
      .orWhere('usuario.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('usuario.apellido LIKE :query', { query: `%${query}%` })
      .orderBy('resena.fecha', 'DESC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [resenas, total] = await queryBuilder.getManyAndCount();

    return {
      resenas: resenas.map(resena => this.buildResenaResponse(resena)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      promedio_calificacion: 0, // Se podría calcular para los resultados
      distribucion_calificaciones: {},
    };
  }

  async getResenasStats(): Promise<ResenasStatsResponse> {
    // Total de reseñas
    const total_resenas = await this.resenaRepository.count();

    // Promedio general
    const result = await this.resenaRepository
      .createQueryBuilder('resena')
      .select('AVG(resena.calificacion)', 'promedio')
      .getRawOne();
    const promedio_general = parseFloat(result.promedio) || 0;

    // Reseñas por mes (últimos 12 meses)
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - 12);

    const resenas_por_mes = await this.resenaRepository
      .createQueryBuilder('resena')
      .select("DATE_FORMAT(resena.fecha, '%Y-%m')", 'mes')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('AVG(resena.calificacion)', 'promedio_mes')
      .where('resena.fecha >= :fechaLimite', { fechaLimite })
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();

    // Productos mejor valorados
    const productos_mejor_valorados = await this.getTopRatedProducts(10);

    // Usuarios más activos
    const usuarios_mas_activos = await this.resenaRepository
      .createQueryBuilder('resena')
      .leftJoin('resena.usuario', 'usuario')
      .select('usuario.id_usuario', 'id_usuario')
      .addSelect('usuario.nombre', 'nombre')
      .addSelect('usuario.apellido', 'apellido')
      .addSelect('COUNT(*)', 'total_resenas')
      .addSelect('AVG(resena.calificacion)', 'calificacion_promedio')
      .groupBy('usuario.id_usuario')
      .orderBy('total_resenas', 'DESC')
      .limit(10)
      .getRawMany();

    // Distribución global de calificaciones
    const distribucion_calificaciones_global = await this.getCalificacionDistribution();

    return {
      total_resenas,
      promedio_general,
      resenas_por_mes,
      productos_mejor_valorados,
      usuarios_mas_activos,
      distribucion_calificaciones_global,
    };
  }

  async hasUserReviewed(userId: number, productId: number): Promise<boolean> {
    const resena = await this.resenaRepository.findOne({
      where: {
        usuario: { id_usuario: userId },
        id_producto: productId
      }
    });

    return !!resena;
  }

  async getUserResenaForProduct(userId: number, productId: number): Promise<ResenaResponse | null> {
    const resena = await this.resenaRepository.findOne({
      where: {
        usuario: { id_usuario: userId },
        id_producto: productId
      },
      relations: ['usuario']
    });

    return resena ? this.buildResenaResponse(resena) : null;
  }

  async update(id: number, updateResenaDto: UpdateResenaDto, currentUserId?: number): Promise<ResenaResponse> {
    const resena = await this.resenaRepository.findOne({
      where: { id_resena: id },
      relations: ['usuario']
    });

    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    // Verificar que el usuario actual sea el autor de la reseña
    if (currentUserId && resena.usuario.id_usuario !== currentUserId) {
      throw new ForbiddenException('Solo puedes editar tus propias reseñas');
    }

    // Actualizar campos
    if (updateResenaDto.calificacion !== undefined) {
      resena.calificacion = updateResenaDto.calificacion;
    }

    if (updateResenaDto.comentario !== undefined) {
      const contenidoLimpio = updateResenaDto.comentario.trim();
      if (!contenidoLimpio) {
        throw new BadRequestException('La reseña no puede estar vacía');
      }
      resena.comentario = contenidoLimpio;
      // Podrías agregar un campo fecha_editado a la entidad
    }

    const updated = await this.resenaRepository.save(resena);
    return this.buildResenaResponse(updated);
  }

  async remove(id: number, currentUserId?: number): Promise<void> {
    const resena = await this.resenaRepository.findOne({
      where: { id_resena: id },
      relations: ['usuario']
    });

    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    // Verificar permisos (el autor o un admin pueden eliminar)
    if (currentUserId && resena.usuario.id_usuario !== currentUserId) {
      // Aquí podrías verificar si es admin
      throw new ForbiddenException('Solo puedes eliminar tus propias reseñas');
    }

    await this.resenaRepository.remove(resena);
  }

  async removeByProduct(productId: number): Promise<void> {
    const resenas = await this.resenaRepository.find({
      where: { id_producto: productId }
    });

    if (resenas.length > 0) {
      await this.resenaRepository.remove(resenas);
    }
  }

  async removeByUser(userId: number): Promise<void> {
    const resenas = await this.resenaRepository.find({
      where: { usuario: { id_usuario: userId } }
    });

    if (resenas.length > 0) {
      await this.resenaRepository.remove(resenas);
    }
  }

  private async calculateAverageRating(productId?: number): Promise<number> {
    const queryBuilder = this.resenaRepository
      .createQueryBuilder('resena')
      .select('AVG(resena.calificacion)', 'promedio');

    if (productId) {
      queryBuilder.where('resena.id_producto = :productId', { productId });
    }

    const result = await queryBuilder.getRawOne();
    return Math.round((parseFloat(result.promedio) || 0) * 10) / 10; // Redondear a 1 decimal
  }

  private async getCalificacionDistribution(productId?: number): Promise<Record<number, number>> {
    const queryBuilder = this.resenaRepository
      .createQueryBuilder('resena')
      .select('resena.calificacion', 'calificacion')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('resena.calificacion');

    if (productId) {
      queryBuilder.where('resena.id_producto = :productId', { productId });
    }

    const results = await queryBuilder.getRawMany();

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    results.forEach(result => {
      distribution[result.calificacion] = parseInt(result.cantidad);
    });

    return distribution;
  }

  private buildResenaResponse(resena: Resena, currentUserId?: number): ResenaResponse {
    return {
      id_resena: resena.id_resena,
      id_producto: resena.id_producto,
      calificacion: resena.calificacion,
      comentario: resena.comentario,
      fecha: resena.fecha,
      usuario: resena.usuario ? {
        id_usuario: resena.usuario.id_usuario,
        nombre: resena.usuario.nombre,
        apellido: resena.usuario.apellido,
        // foto_perfil se completaría con datos del perfil de usuario
      } : undefined,
      es_autor: currentUserId ? resena.usuario?.id_usuario === currentUserId : undefined,
      // El producto_info se completaría con joins a las tablas correspondientes
    };
  }
}
