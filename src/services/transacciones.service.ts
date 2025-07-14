import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaccion } from '../models/entities/transacciones.entity';
import { CreateTransaccioneDto } from '../dto/create-transaccione.dto';
import { UpdateTransaccioneDto } from '../dto/update-transaccione.dto';
import { FilterTransaccionesDto } from '../dto/filter-transacciones.dto';
import { TransaccionResponse, TransaccionesPaginatedResponse, TransaccionesStatsResponse } from '../interfaces/transaccion-response.interface';

@Injectable()
export class TransaccionesService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
  ) {}

  async create(createTransaccioneDto: CreateTransaccioneDto): Promise<TransaccionResponse> {
    // Validar que el monto sea positivo
    if (createTransaccioneDto.monto <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    // Verificar si ya existe una transacción para esta venta
    const existingTransaction = await this.transaccionRepository.findOne({
      where: { 
        venta: { id_venta: createTransaccioneDto.id_venta },
        estado: 'Completada'
      }
    });

    if (existingTransaction) {
      throw new ConflictException('Ya existe una transacción completada para esta venta');
    }

    const transaccion = this.transaccionRepository.create({
      usuario: { id_usuario: createTransaccioneDto.id_usuario },
      venta: { id_venta: createTransaccioneDto.id_venta },
      metodo_pago: { id_metodo_pago: createTransaccioneDto.id_metodo_pago },
      monto: createTransaccioneDto.monto,
      estado: createTransaccioneDto.estado || 'Pendiente',
      fecha: new Date(),
      referencia_externa: createTransaccioneDto.referencia_externa,
      notas: createTransaccioneDto.notas,
      promocion: createTransaccioneDto.id_promocion ? { id_promocion: createTransaccioneDto.id_promocion } : undefined,
    });

    const saved = await this.transaccionRepository.save(transaccion);
    return this.buildTransaccionResponse(saved);
  }

  async findAll(filterDto?: FilterTransaccionesDto): Promise<TransaccionesPaginatedResponse> {
    const queryBuilder = this.transaccionRepository
      .createQueryBuilder('transaccion')
      .leftJoinAndSelect('transaccion.usuario', 'usuario')
      .leftJoinAndSelect('transaccion.venta', 'venta')
      .leftJoinAndSelect('transaccion.metodo_pago', 'metodo_pago')
      .leftJoinAndSelect('transaccion.promocion', 'promocion');

    // Aplicar filtros
    if (filterDto?.id_usuario) {
      queryBuilder.andWhere('transaccion.usuario = :userId', { userId: filterDto.id_usuario });
    }

    if (filterDto?.id_metodo_pago) {
      queryBuilder.andWhere('transaccion.metodo_pago = :metodoPagoId', { metodoPagoId: filterDto.id_metodo_pago });
    }

    if (filterDto?.estado) {
      queryBuilder.andWhere('transaccion.estado = :estado', { estado: filterDto.estado });
    }

    if (filterDto?.fecha_desde && filterDto?.fecha_hasta) {
      queryBuilder.andWhere('transaccion.fecha BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filterDto.fecha_desde,
        fechaHasta: filterDto.fecha_hasta,
      });
    }

    if (filterDto?.monto_minimo) {
      queryBuilder.andWhere('transaccion.monto >= :montoMinimo', { montoMinimo: filterDto.monto_minimo });
    }

    if (filterDto?.monto_maximo) {
      queryBuilder.andWhere('transaccion.monto <= :montoMaximo', { montoMaximo: filterDto.monto_maximo });
    }

    if (filterDto?.referencia_externa) {
      queryBuilder.andWhere('transaccion.referencia_externa LIKE :referencia', { 
        referencia: `%${filterDto.referencia_externa}%` 
      });
    }

    // Ordenamiento
    const orden = filterDto?.orden_fecha || 'desc';
    queryBuilder.orderBy('transaccion.fecha', orden.toUpperCase() as 'ASC' | 'DESC');

    // Paginación
    const page = filterDto?.page || 1;
    const limit = filterDto?.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [transacciones, total] = await queryBuilder.getManyAndCount();

    // Calcular resumen
    const resumen = await this.calculateResumen(filterDto);

    return {
      transacciones: transacciones.map(transaccion => this.buildTransaccionResponse(transaccion)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      resumen,
    };
  }

  async findOne(id: number): Promise<TransaccionResponse> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id_transaccion: id },
      relations: ['usuario', 'venta', 'metodo_pago', 'promocion'],
    });

    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return this.buildTransaccionResponse(transaccion);
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<TransaccionesPaginatedResponse> {
    const filterDto: FilterTransaccionesDto = {
      id_usuario: userId,
      page,
      limit,
      orden_fecha: 'desc'
    };

    return this.findAll(filterDto);
  }

  async findByVenta(ventaId: number): Promise<TransaccionResponse[]> {
    const transacciones = await this.transaccionRepository.find({
      where: { venta: { id_venta: ventaId } },
      relations: ['usuario', 'venta', 'metodo_pago', 'promocion'],
      order: { fecha: 'DESC' }
    });

    return transacciones.map(transaccion => this.buildTransaccionResponse(transaccion));
  }

  async findByEstado(estado: string): Promise<TransaccionResponse[]> {
    const transacciones = await this.transaccionRepository.find({
      where: { estado },
      relations: ['usuario', 'venta', 'metodo_pago', 'promocion'],
      order: { fecha: 'DESC' }
    });

    return transacciones.map(transaccion => this.buildTransaccionResponse(transaccion));
  }

  async update(id: number, updateTransaccioneDto: UpdateTransaccioneDto): Promise<TransaccionResponse> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id_transaccion: id }
    });

    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    // Validar cambio de estado
    if (updateTransaccioneDto.estado && transaccion.estado === 'Completada') {
      throw new BadRequestException('No se puede modificar una transacción completada');
    }

    Object.assign(transaccion, updateTransaccioneDto);
    const updated = await this.transaccionRepository.save(transaccion);
    
    return this.buildTransaccionResponse(updated);
  }

  async updateEstado(id: number, nuevoEstado: string, referencia?: string, notas?: string): Promise<TransaccionResponse> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id_transaccion: id }
    });

    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    transaccion.estado = nuevoEstado;
    if (referencia) transaccion.referencia_externa = referencia;
    if (notas) transaccion.notas = notas;

    const updated = await this.transaccionRepository.save(transaccion);
    return this.buildTransaccionResponse(updated);
  }

  async remove(id: number): Promise<void> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id_transaccion: id }
    });

    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    if (transaccion.estado === 'Completada') {
      throw new BadRequestException('No se puede eliminar una transacción completada');
    }

    await this.transaccionRepository.remove(transaccion);
  }

  async getTransaccionesStats(fechaDesde?: string, fechaHasta?: string): Promise<TransaccionesStatsResponse> {
    let baseQuery = this.transaccionRepository.createQueryBuilder('transaccion');

    if (fechaDesde && fechaHasta) {
      baseQuery = baseQuery.where('transaccion.fecha BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde,
        fechaHasta,
      });
    }

    // Total de transacciones
    const total_transacciones = await baseQuery.getCount();

    // Monto total
    const montoResult = await baseQuery
      .select('SUM(transaccion.monto)', 'total')
      .getRawOne();
    const monto_total = parseFloat(montoResult.total) || 0;

    // Transacciones por estado
    const estadosResult = await this.transaccionRepository
      .createQueryBuilder('transaccion')
      .select('transaccion.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('transaccion.estado')
      .getRawMany();

    const transacciones_por_estado: Record<string, number> = {};
    estadosResult.forEach(result => {
      transacciones_por_estado[result.estado] = parseInt(result.cantidad);
    });

    // Transacciones por método de pago
    const transacciones_por_metodo = await this.transaccionRepository
      .createQueryBuilder('transaccion')
      .leftJoin('transaccion.metodo_pago', 'metodo_pago')
      .select('metodo_pago.nombre_metodo', 'metodo')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('SUM(transaccion.monto)', 'monto_total')
      .groupBy('metodo_pago.id_metodo_pago')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Ingresos por mes (últimos 12 meses)
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - 12);

    const ingresos_por_mes = await this.transaccionRepository
      .createQueryBuilder('transaccion')
      .select("DATE_FORMAT(transaccion.fecha, '%Y-%m')", 'mes')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('SUM(transaccion.monto)', 'monto_total')
      .where('transaccion.fecha >= :fechaLimite', { fechaLimite })
      .andWhere('transaccion.estado = :estado', { estado: 'Completada' })
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();

    // Promedio de transacción
    const promedio_transaccion = total_transacciones > 0 ? monto_total / total_transacciones : 0;

    // Métodos más usados
    const metodos_mas_usados = transacciones_por_metodo.slice(0, 5);

    return {
      total_transacciones,
      monto_total,
      transacciones_por_estado,
      transacciones_por_metodo,
      ingresos_por_mes,
      promedio_transaccion: Math.round(promedio_transaccion * 100) / 100,
      metodos_mas_usados,
    };
  }

  async getIngresosDelDia(fecha?: string): Promise<number> {
    const targetDate = fecha ? new Date(fecha) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const result = await this.transaccionRepository
      .createQueryBuilder('transaccion')
      .select('SUM(transaccion.monto)', 'total')
      .where('transaccion.fecha BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
      .andWhere('transaccion.estado = :estado', { estado: 'Completada' })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  private async calculateResumen(filterDto?: FilterTransaccionesDto): Promise<any> {
    let queryBuilder = this.transaccionRepository.createQueryBuilder('transaccion');

    // Aplicar los mismos filtros que en findAll
    if (filterDto?.id_usuario) {
      queryBuilder.andWhere('transaccion.usuario = :userId', { userId: filterDto.id_usuario });
    }
    if (filterDto?.id_metodo_pago) {
      queryBuilder.andWhere('transaccion.metodo_pago = :metodoPagoId', { metodoPagoId: filterDto.id_metodo_pago });
    }
    if (filterDto?.fecha_desde && filterDto?.fecha_hasta) {
      queryBuilder.andWhere('transaccion.fecha BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filterDto.fecha_desde,
        fechaHasta: filterDto.fecha_hasta,
      });
    }

    const [total_monto, completadas, pendientes, fallidas, canceladas] = await Promise.all([
      queryBuilder.select('SUM(transaccion.monto)', 'total').getRawOne().then(r => parseFloat(r.total) || 0),
      queryBuilder.where('transaccion.estado = :estado', { estado: 'Completada' }).getCount(),
      queryBuilder.where('transaccion.estado = :estado', { estado: 'Pendiente' }).getCount(),
      queryBuilder.where('transaccion.estado = :estado', { estado: 'Fallida' }).getCount(),
      queryBuilder.where('transaccion.estado = :estado', { estado: 'Cancelada' }).getCount(),
    ]);

    return {
      total_monto,
      completadas,
      pendientes,
      fallidas,
      canceladas,
    };
  }

  private buildTransaccionResponse(transaccion: Transaccion): TransaccionResponse {
    return {
      id_transaccion: transaccion.id_transaccion,
      id_usuario: transaccion.usuario?.id_usuario,
      id_venta: transaccion.venta?.id_venta,
      id_metodo_pago: transaccion.metodo_pago?.id_metodo_pago,
      monto: transaccion.monto,
      estado: transaccion.estado,
      fecha: transaccion.fecha,
      referencia_externa: transaccion.referencia_externa,
      notas: transaccion.notas,
      id_promocion: transaccion.promocion?.id_promocion,
      usuario: transaccion.usuario ? {
        id_usuario: transaccion.usuario.id_usuario,
        nombre: transaccion.usuario.nombre,
        apellido: transaccion.usuario.apellido,
        correo: transaccion.usuario.correo,
      } : undefined,
      venta: transaccion.venta,
      metodo_pago: transaccion.metodo_pago ? {
        id_metodo_pago: transaccion.metodo_pago.id_metodo_pago,
        nombre_metodo: transaccion.metodo_pago.nombre_metodo,
        comision_porcentaje: transaccion.metodo_pago.comision_porcentaje,
      } : undefined,
      promocion: transaccion.promocion ? {
        id_promocion: transaccion.promocion.id_promocion,
        nombre: transaccion.promocion.nombre,
        codigo_promocion: transaccion.promocion.codigo_promocion,
      } : undefined,
    };
  }
}