import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Promocion } from '../models/entities/promociones.entity';
import { CreatePromocioneDto } from './dto/create-promocione.dto';
import { UpdatePromocioneDto } from './dto/update-promocione.dto';
import { PromocionResponse } from './interfaces/promocion-response.interface';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(Promocion)
    private readonly promocionRepository: Repository<Promocion>,
  ) {}

  async create(createPromocioneDto: CreatePromocioneDto): Promise<PromocionResponse> {
    // Validar fechas
    const fechaInicio = new Date(createPromocioneDto.fecha_inicio);
    const fechaFin = new Date(createPromocioneDto.fecha_fin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Verificar código único si se proporciona
    if (createPromocioneDto.codigo_promocion) {
      const existing = await this.promocionRepository.findOne({
        where: { codigo_promocion: createPromocioneDto.codigo_promocion }
      });
      if (existing) {
        throw new ConflictException('Ya existe una promoción con ese código');
      }
    }

    const promocion = this.promocionRepository.create({
      nombre: createPromocioneDto.nombre,
      descripcion: createPromocioneDto.descripcion,
      tipo_descuento: createPromocioneDto.tipo_descuento,
      valor_descuento: createPromocioneDto.valor_descuento,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      codigo_promocion: createPromocioneDto.codigo_promocion,
      limite_usos: createPromocioneDto.limite_usos,
      usos_actuales: 0,
      monto_minimo_compra: createPromocioneDto.monto_minimo_compra,
      productos_aplicables: createPromocioneDto.productos_aplicables,
      activa: createPromocioneDto.activa ?? true,
      fecha_creacion: new Date(),
    });

    const saved = await this.promocionRepository.save(promocion);
    return this.buildPromocionResponse(saved);
  }

  async findAll(): Promise<PromocionResponse[]> {
    const promociones = await this.promocionRepository.find({
      order: { fecha_creacion: 'DESC' }
    });

    return promociones.map(promocion => this.buildPromocionResponse(promocion));
  }

  async findActive(): Promise<PromocionResponse[]> {
    const now = new Date();
    const promociones = await this.promocionRepository.find({
      where: {
        activa: true,
        fecha_inicio: Between(new Date('1900-01-01'), now),
        fecha_fin: Between(now, new Date('2100-12-31')),
      },
      order: { fecha_fin: 'ASC' }
    });

    return promociones
      .filter(promocion => this.isPromocionVigente(promocion))
      .map(promocion => this.buildPromocionResponse(promocion));
  }

  async findByCode(codigo: string): Promise<PromocionResponse> {
    const promocion = await this.promocionRepository.findOne({
      where: { codigo_promocion: codigo }
    });

    if (!promocion) {
      throw new NotFoundException(`Promoción con código ${codigo} no encontrada`);
    }

    return this.buildPromocionResponse(promocion);
  }

  async findOne(id: number): Promise<PromocionResponse> {
    const promocion = await this.promocionRepository.findOne({
      where: { id_promocion: id }
    });

    if (!promocion) {
      throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    }

    return this.buildPromocionResponse(promocion);
  }

  async update(id: number, updatePromocioneDto: UpdatePromocioneDto): Promise<PromocionResponse> {
    const promocion = await this.promocionRepository.findOne({
      where: { id_promocion: id }
    });

    if (!promocion) {
      throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    }

    // Validar fechas si se actualizan
    if (updatePromocioneDto.fecha_inicio || updatePromocioneDto.fecha_fin) {
      const fechaInicio = updatePromocioneDto.fecha_inicio ? new Date(updatePromocioneDto.fecha_inicio) : promocion.fecha_inicio;
      const fechaFin = updatePromocioneDto.fecha_fin ? new Date(updatePromocioneDto.fecha_fin) : promocion.fecha_fin;

      if (fechaFin <= fechaInicio) {
        throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    // Verificar código único si se actualiza
    if (updatePromocioneDto.codigo_promocion && updatePromocioneDto.codigo_promocion !== promocion.codigo_promocion) {
      const existing = await this.promocionRepository.findOne({
        where: { codigo_promocion: updatePromocioneDto.codigo_promocion }
      });
      if (existing && existing.id_promocion !== id) {
        throw new ConflictException('Ya existe una promoción con ese código');
      }
    }

    Object.assign(promocion, updatePromocioneDto);
    const updated = await this.promocionRepository.save(promocion);
    return this.buildPromocionResponse(updated);
  }

  async remove(id: number): Promise<void> {
    const promocion = await this.promocionRepository.findOne({
      where: { id_promocion: id }
    });

    if (!promocion) {
      throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    }

    await this.promocionRepository.remove(promocion);
  }

  async incrementarUso(id: number): Promise<PromocionResponse> {
    const promocion = await this.promocionRepository.findOne({
      where: { id_promocion: id }
    });

    if (!promocion) {
      throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    }

    if (!this.isPromocionVigente(promocion)) {
      throw new BadRequestException('La promoción no está vigente');
    }

    if (promocion.limite_usos && promocion.usos_actuales >= promocion.limite_usos) {
      throw new BadRequestException('La promoción ha alcanzado su límite de usos');
    }

    promocion.usos_actuales += 1;
    const updated = await this.promocionRepository.save(promocion);
    return this.buildPromocionResponse(updated);
  }

  async validatePromocion(codigo: string, montoCompra: number): Promise<{ valid: boolean; promocion?: PromocionResponse; error?: string }> {
    try {
      const promocion = await this.findByCode(codigo);
      
      if (!this.isPromocionVigente(promocion)) {
        return { valid: false, error: 'La promoción no está vigente' };
      }

      if (!promocion.activa) {
        return { valid: false, error: 'La promoción no está activa' };
      }

      if (promocion.limite_usos && promocion.usos_actuales >= promocion.limite_usos) {
        return { valid: false, error: 'La promoción ha alcanzado su límite de usos' };
      }

      if (promocion.monto_minimo_compra && montoCompra < promocion.monto_minimo_compra) {
        return { valid: false, error: `El monto mínimo de compra es $${promocion.monto_minimo_compra}` };
      }

      return { valid: true, promocion };
    } catch (error) {
      return { valid: false, error: 'Código de promoción no válido' };
    }
  }

  private isPromocionVigente(promocion: Promocion): boolean {
    const now = new Date();
    return promocion.fecha_inicio <= now && promocion.fecha_fin >= now;
  }

  private buildPromocionResponse(promocion: Promocion): PromocionResponse {
    return {
      id_promocion: promocion.id_promocion,
      nombre: promocion.nombre,
      descripcion: promocion.descripcion,
      tipo_descuento: promocion.tipo_descuento,
      valor_descuento: promocion.valor_descuento,
      fecha_inicio: promocion.fecha_inicio,
      fecha_fin: promocion.fecha_fin,
      codigo_promocion: promocion.codigo_promocion,
      limite_usos: promocion.limite_usos,
      usos_actuales: promocion.usos_actuales,
      monto_minimo_compra: promocion.monto_minimo_compra,
      productos_aplicables: promocion.productos_aplicables,
      activa: promocion.activa,
      vigente: this.isPromocionVigente(promocion),
      fecha_creacion: promocion.fecha_creacion,
    };
  }
}