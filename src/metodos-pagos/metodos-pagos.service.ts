import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from '../models/entities/metodosPagos.entity';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
import { MetodoPagoResponse } from './interfaces/metodo-pago-response.interface';

@Injectable()
export class MetodosPagosService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepository: Repository<MetodoPago>,
  ) {}

  async create(createMetodosPagoDto: CreateMetodosPagoDto): Promise<MetodoPagoResponse> {
    // Verificar si el método de pago ya existe
    const existing = await this.metodoPagoRepository.findOne({
      where: { nombre_metodo: createMetodosPagoDto.nombre_metodo }
    });

    if (existing) {
      throw new ConflictException('Ya existe un método de pago con ese nombre');
    }

    const metodoPago = this.metodoPagoRepository.create({
      nombre_metodo: createMetodosPagoDto.nombre_metodo,
      descripcion: createMetodosPagoDto.descripcion,
      activo: createMetodosPagoDto.activo ?? true,
      comision_porcentaje: createMetodosPagoDto.comision_porcentaje,
      icono_url: createMetodosPagoDto.icono_url,
      proveedor: createMetodosPagoDto.proveedor,
      fecha_creacion: new Date(),
    });

    const saved = await this.metodoPagoRepository.save(metodoPago);
    return this.buildMetodoPagoResponse(saved);
  }

  async findAll(): Promise<MetodoPagoResponse[]> {
    const metodos = await this.metodoPagoRepository.find({
      order: { nombre_metodo: 'ASC' }
    });

    return metodos.map(metodo => this.buildMetodoPagoResponse(metodo));
  }

  async findActive(): Promise<MetodoPagoResponse[]> {
    const metodos = await this.metodoPagoRepository.find({
      where: { activo: true },
      order: { nombre_metodo: 'ASC' }
    });

    return metodos.map(metodo => this.buildMetodoPagoResponse(metodo));
  }

  async findOne(id: number): Promise<MetodoPagoResponse> {
    const metodoPago = await this.metodoPagoRepository.findOne({
      where: { id_metodo_pago: id }
    });

    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }

    return this.buildMetodoPagoResponse(metodoPago);
  }

  async update(id: number, updateMetodosPagoDto: UpdateMetodosPagoDto): Promise<MetodoPagoResponse> {
    const metodoPago = await this.metodoPagoRepository.findOne({
      where: { id_metodo_pago: id }
    });

    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }

    // Verificar nombre único si se actualiza
    if (updateMetodosPagoDto.nombre_metodo && updateMetodosPagoDto.nombre_metodo !== metodoPago.nombre_metodo) {
      const existing = await this.metodoPagoRepository.findOne({
        where: { nombre_metodo: updateMetodosPagoDto.nombre_metodo }
      });
      if (existing && existing.id_metodo_pago !== id) {
        throw new ConflictException('Ya existe un método de pago con ese nombre');
      }
    }

    Object.assign(metodoPago, updateMetodosPagoDto);
    const updated = await this.metodoPagoRepository.save(metodoPago);
    return this.buildMetodoPagoResponse(updated);
  }

  async remove(id: number): Promise<void> {
    const metodoPago = await this.metodoPagoRepository.findOne({
      where: { id_metodo_pago: id }
    });

    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }

    await this.metodoPagoRepository.remove(metodoPago);
  }

  async initializeDefaultMethods(): Promise<void> {
    const defaultMethods = [
      { 
        nombre_metodo: 'Tarjeta de Crédito', 
        descripcion: 'Pago con tarjeta de crédito',
        comision_porcentaje: 3.5,
        proveedor: 'Stripe'
      },
      { 
        nombre_metodo: 'Tarjeta de Débito', 
        descripcion: 'Pago con tarjeta de débito',
        comision_porcentaje: 2.5,
        proveedor: 'Stripe'
      },
      { 
        nombre_metodo: 'PayPal', 
        descripcion: 'Pago a través de PayPal',
        comision_porcentaje: 4.0,
        proveedor: 'PayPal'
      },
      { 
        nombre_metodo: 'Transferencia Bancaria', 
        descripcion: 'Transferencia bancaria directa',
        comision_porcentaje: 1.0
      },
      { 
        nombre_metodo: 'Efectivo', 
        descripcion: 'Pago en efectivo',
        comision_porcentaje: 0.0
      }
    ];

    for (const methodData of defaultMethods) {
      const existing = await this.metodoPagoRepository.findOne({
        where: { nombre_metodo: methodData.nombre_metodo }
      });
      if (!existing) {
        await this.create(methodData);
      }
    }
  }

  private buildMetodoPagoResponse(metodoPago: MetodoPago): MetodoPagoResponse {
    return {
      id_metodo_pago: metodoPago.id_metodo_pago,
      nombre_metodo: metodoPago.nombre_metodo,
      descripcion: metodoPago.descripcion,
      activo: metodoPago.activo,
      comision_porcentaje: metodoPago.comision_porcentaje,
      icono_url: metodoPago.icono_url,
      proveedor: metodoPago.proveedor,
      fecha_creacion: metodoPago.fecha_creacion,
    };
  }
}