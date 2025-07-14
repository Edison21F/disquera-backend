import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DetalleVenta } from '../models/entities/detalleVentas.entity';
import { CreateVentaDto, VentaItemDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { VentaResponse, VentaItemResponse, VentasStatsResponse } from '../interfaces/venta-response.interface';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly ventaRepository: Repository<DetalleVenta>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<VentaResponse> {
    if (!createVentaDto.items || createVentaDto.items.length === 0) {
      throw new BadRequestException('La venta debe tener al menos un item');
    }

    // Generar número de venta único
    const numeroVenta = await this.generateVentaNumber();
    
    // Calcular totales
    const subtotal = createVentaDto.items.reduce((sum, item) => 
      sum + (item.precio_unitario * item.cantidad), 0
    );

    const descuento = createVentaDto.descuento_aplicado || 0;
    const impuestos = this.calculateTaxes(subtotal - descuento);
    const total = subtotal - descuento + impuestos;

    // Crear items de venta
    const ventaItems: DetalleVenta[] = [];
    
    for (const item of createVentaDto.items) {
      const detalleVenta = this.ventaRepository.create({
        usuario: { id_usuario: createVentaDto.id_usuario },
        id_producto: item.id_producto,
        tipo_producto: item.tipo_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        fecha_venta: new Date(),
        monto_total: item.precio_unitario * item.cantidad,
        estado: { id_estado: 1 }, // Pendiente por defecto
      });

      const saved = await this.ventaRepository.save(detalleVenta);
      ventaItems.push(saved);
    }

    // Construir respuesta agrupada
    return this.buildVentaResponse(ventaItems, numeroVenta);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ ventas: VentaResponse[]; total: number; total_pages: number }> {
    const skip = (page - 1) * limit;

    const [items, total] = await this.ventaRepository.findAndCount({
      relations: ['usuario', 'estado'],
      order: { fecha_venta: 'DESC' },
      skip,
      take: limit,
    });

    // Agrupar por venta (usando fecha y usuario como clave)
    const ventasAgrupadas = this.groupVentasByTransaction(items);

    return {
      ventas: ventasAgrupadas.slice(0, limit),
      total: Math.ceil(total / 3), // Estimación porque agrupamos items
      total_pages: Math.ceil(Math.ceil(total / 3) / limit),
    };
  }

  async findOne(id: number): Promise<VentaResponse> {
    const items = await this.ventaRepository.find({
      where: { id_venta: id },
      relations: ['usuario', 'estado'],
    });

    if (items.length === 0) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return this.buildVentaResponse(items);
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<{ ventas: VentaResponse[]; total: number }> {
    const skip = (page - 1) * limit;

    const items = await this.ventaRepository.find({
      where: { usuario: { id_usuario: userId } },
      relations: ['usuario', 'estado'],
      order: { fecha_venta: 'DESC' },
      skip,
      take: limit * 5, // Tomar más porque agruparemos
    });

    const ventasAgrupadas = this.groupVentasByTransaction(items);

    return {
      ventas: ventasAgrupadas.slice(0, limit),
      total: ventasAgrupadas.length,
    };
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<VentaResponse[]> {
    const items = await this.ventaRepository.find({
      where: {
        fecha_venta: Between(new Date(fechaInicio), new Date(fechaFin))
      },
      relations: ['usuario', 'estado'],
      order: { fecha_venta: 'DESC' },
    });

    return this.groupVentasByTransaction(items);
  }

  async findByProduct(productId: number, tipo: string): Promise<VentaItemResponse[]> {
    const items = await this.ventaRepository.find({
      where: {
        id_producto: productId,
        tipo_producto: tipo as any
      },
      relations: ['usuario', 'estado'],
      order: { fecha_venta: 'DESC' },
    });

    return items.map(item => this.buildVentaItemResponse(item));
  }

  async getVentasStats(fechaInicio?: string, fechaFin?: string): Promise<VentasStatsResponse> {
    let whereCondition = {};
    
    if (fechaInicio && fechaFin) {
      whereCondition = {
        fecha_venta: Between(new Date(fechaInicio), new Date(fechaFin))
      };
    }

    // Total de ventas e ingresos
    const totalStats = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('COUNT(DISTINCT CONCAT(venta.usuario, DATE(venta.fecha_venta)))', 'total_ventas')
      .addSelect('SUM(venta.monto_total)', 'total_ingresos')
      .addSelect('AVG(venta.monto_total)', 'venta_promedio')
      .where(whereCondition)
      .getRawOne();

    // Ventas por mes
    const ventas_por_mes = await this.ventaRepository
      .createQueryBuilder('venta')
      .select("DATE_FORMAT(venta.fecha_venta, '%Y-%m')", 'mes')
      .addSelect('COUNT(DISTINCT CONCAT(venta.usuario, DATE(venta.fecha_venta)))', 'cantidad_ventas')
      .addSelect('SUM(venta.monto_total)', 'ingresos')
      .where(whereCondition)
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();

    // Productos más vendidos
    const productos_mas_vendidos = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('venta.id_producto', 'id_producto')
      .addSelect('venta.tipo_producto', 'tipo_producto')
      .addSelect('SUM(venta.cantidad)', 'total_vendido')
      .addSelect('SUM(venta.monto_total)', 'ingresos_generados')
      .where(whereCondition)
      .groupBy('venta.id_producto, venta.tipo_producto')
      .orderBy('total_vendido', 'DESC')
      .limit(10)
      .getRawMany();

    // Usuarios top
    const usuarios_top = await this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoin('venta.usuario', 'usuario')
      .select('usuario.id_usuario', 'id_usuario')
      .addSelect('usuario.nombre', 'nombre')
      .addSelect('usuario.apellido', 'apellido')
      .addSelect('COUNT(DISTINCT DATE(venta.fecha_venta))', 'total_compras')
      .addSelect('SUM(venta.monto_total)', 'total_gastado')
      .where(whereCondition)
      .groupBy('usuario.id_usuario')
      .orderBy('total_gastado', 'DESC')
      .limit(10)
      .getRawMany();

    // Distribución de estados
    const estados_distribucion = await this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoin('venta.estado', 'estado')
      .select('estado.descripcion', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .where(whereCondition)
      .groupBy('estado.descripcion')
      .getRawMany();

    const estadosMap: Record<string, number> = {};
    estados_distribucion.forEach(item => {
      estadosMap[item.estado] = parseInt(item.cantidad);
    });

    return {
      total_ventas: parseInt(totalStats.total_ventas) || 0,
      total_ingresos: parseFloat(totalStats.total_ingresos) || 0,
      venta_promedio: parseFloat(totalStats.venta_promedio) || 0,
      ventas_por_mes,
      productos_mas_vendidos,
      usuarios_top,
      estados_distribucion: estadosMap,
    };
  }

  async getTopSellingProducts(limit: number = 10): Promise<any[]> {
    return await this.ventaRepository
      .createQueryBuilder('venta')
      .select('venta.id_producto', 'id_producto')
      .addSelect('venta.tipo_producto', 'tipo_producto')
      .addSelect('SUM(venta.cantidad)', 'total_vendido')
      .addSelect('COUNT(DISTINCT venta.usuario)', 'compradores_unicos')
      .addSelect('SUM(venta.monto_total)', 'ingresos_totales')
      .groupBy('venta.id_producto, venta.tipo_producto')
      .orderBy('total_vendido', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getUserPurchaseHistory(userId: number): Promise<any> {
    const stats = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('COUNT(DISTINCT DATE(venta.fecha_venta))', 'total_compras')
      .addSelect('SUM(venta.monto_total)', 'total_gastado')
      .addSelect('AVG(venta.monto_total)', 'compra_promedio')
      .addSelect('MAX(venta.fecha_venta)', 'ultima_compra')
      .where('venta.usuario = :userId', { userId })
      .getRawOne();

    const categorias = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('venta.tipo_producto', 'categoria')
      .addSelect('SUM(venta.cantidad)', 'cantidad_comprada')
      .addSelect('SUM(venta.monto_total)', 'total_gastado')
      .where('venta.usuario = :userId', { userId })
      .groupBy('venta.tipo_producto')
      .getRawMany();

    return {
      resumen: stats,
      por_categoria: categorias,
    };
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<VentaResponse> {
    const items = await this.ventaRepository.find({
      where: { id_venta: id },
      relations: ['usuario', 'estado'],
    });

    if (items.length === 0) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    // Actualizar estado si se proporciona
    if (updateVentaDto.estado) {
      for (const item of items) {
        // Aquí deberías mapear el estado string a id_estado
        // item.estado = { id_estado: estadoId };
        await this.ventaRepository.save(item);
      }
    }

    return this.buildVentaResponse(items);
  }

  async cancelVenta(id: number): Promise<VentaResponse> {
    return this.update(id, { estado: 'Cancelada' });
  }

  async refundVenta(id: number): Promise<VentaResponse> {
    return this.update(id, { estado: 'Reembolsada' });
  }

  async remove(id: number): Promise<void> {
    const items = await this.ventaRepository.find({
      where: { id_venta: id }
    });

    if (items.length === 0) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    await this.ventaRepository.remove(items);
  }

  private async generateVentaNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Contar ventas del día
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const ventasHoy = await this.ventaRepository.count({
      where: {
        fecha_venta: Between(startOfDay, endOfDay)
      }
    });

    const sequential = String(ventasHoy + 1).padStart(4, '0');
    return `V${year}${month}${day}-${sequential}`;
  }

  private calculateTaxes(subtotal: number): number {
    // Implementar lógica de impuestos según tu región
    const taxRate = 0.12; // 12% IVA ejemplo
    return subtotal * taxRate;
  }

  private groupVentasByTransaction(items: DetalleVenta[]): VentaResponse[] {
    const grouped = new Map<string, DetalleVenta[]>();

    items.forEach(item => {
      const key = `${item.usuario.id_usuario}-${item.fecha_venta.toDateString()}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    });

    return Array.from(grouped.values()).map(group => 
      this.buildVentaResponse(group)
    );
  }

  private buildVentaResponse(items: DetalleVenta[], numeroVenta?: string): VentaResponse {
    const subtotal = items.reduce((sum, item) => sum + item.monto_total, 0);
    const descuento = 0; // Calcular desde promociones
    const impuestos = this.calculateTaxes(subtotal - descuento);
    const total = subtotal - descuento + impuestos;

    return {
      id_venta: items[0].id_venta,
      numero_venta: numeroVenta || `V${items[0].id_venta}`,
      fecha_venta: items[0].fecha_venta,
      subtotal,
      descuento,
      impuestos,
      total,
      estado: items[0].estado?.descripcion || 'Pendiente',
      items: items.map(item => this.buildVentaItemResponse(item)),
      usuario: items[0].usuario,
    };
  }

  private buildVentaItemResponse(item: DetalleVenta): VentaItemResponse {
    return {
      id_venta: item.id_venta,
      id_producto: item.id_producto,
      tipo_producto: item.tipo_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.monto_total,
    };
  }
}