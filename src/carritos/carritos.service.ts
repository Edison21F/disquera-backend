import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from '../models/entities/carritos.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CarritoItemResponse, CarritoSummaryResponse } from './interfaces/carrito-response.interface';

@Injectable()
export class CarritosService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,
  ) {}

  async create(createCarritoDto: CreateCarritoDto): Promise<CarritoItemResponse> {
    // Verificar si el producto ya está en el carrito
    const existingItem = await this.carritoRepository.findOne({
      where: {
        usuario: { id_usuario: createCarritoDto.id_usuario },
        id_carrito: createCarritoDto.id_carrito,
        id_producto: createCarritoDto.id_producto
      }
    });

    if (existingItem) {
      // Si existe, actualizar cantidad
      existingItem.cantidad += createCarritoDto.cantidad;
      const updated = await this.carritoRepository.save(existingItem);
      return this.buildCarritoItemResponse(updated);
    }

    const carritoItem = this.carritoRepository.create({
      usuario: { id_usuario: createCarritoDto.id_usuario },
      id_carrito: createCarritoDto.id_carrito,
      id_producto: createCarritoDto.id_producto,
      cantidad: createCarritoDto.cantidad,
    });

    const saved = await this.carritoRepository.save(carritoItem);
    return this.buildCarritoItemResponse(saved);
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<CarritoItemResponse> {
    // Generar o usar carrito existente para el usuario
    const carritoId = await this.getOrCreateCarritoId(userId);

    const createDto: CreateCarritoDto = {
      id_usuario: userId,
      id_carrito: carritoId,
      id_producto: addToCartDto.id_producto,
      cantidad: addToCartDto.cantidad || 1,
    };

    return this.create(createDto);
  }

  async findAll(): Promise<CarritoItemResponse[]> {
    const items = await this.carritoRepository.find({
      relations: ['usuario'],
      order: { id_carrito_prod: 'DESC' }
    });

    return items.map(item => this.buildCarritoItemResponse(item));
  }

  async findOne(id: number): Promise<CarritoItemResponse> {
    const item = await this.carritoRepository.findOne({
      where: { id_carrito_prod: id },
      relations: ['usuario'],
    });

    if (!item) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }

    return this.buildCarritoItemResponse(item);
  }

  async findByUser(userId: number): Promise<CarritoSummaryResponse[]> {
    const items = await this.carritoRepository.find({
      where: { usuario: { id_usuario: userId } },
      relations: ['usuario'],
      order: { id_carrito: 'ASC', id_carrito_prod: 'DESC' }
    });

    // Agrupar por carrito
    const carritoGroups = this.groupByCarrito(items);
    
    return Promise.all(
      Object.entries(carritoGroups).map(([carritoId, carritoItems]) =>
        this.buildCarritoSummary(Number(carritoId), userId, carritoItems)
      )
    );
  }

  async findActiveCart(userId: number): Promise<CarritoSummaryResponse | null> {
    const carritoId = await this.getActiveCarritoId(userId);
    
    if (!carritoId) {
      return null;
    }

    const items = await this.carritoRepository.find({
      where: { 
        usuario: { id_usuario: userId },
        id_carrito: carritoId 
      },
      relations: ['usuario'],
      order: { id_carrito_prod: 'DESC' }
    });

    if (items.length === 0) {
      return null;
    }

    return this.buildCarritoSummary(carritoId, userId, items);
  }

  async findByCarrito(carritoId: number): Promise<CarritoItemResponse[]> {
    const items = await this.carritoRepository.find({
      where: { id_carrito: carritoId },
      relations: ['usuario'],
      order: { id_carrito_prod: 'DESC' }
    });

    return items.map(item => this.buildCarritoItemResponse(item));
  }

  async update(id: number, updateCarritoDto: UpdateCarritoDto): Promise<CarritoItemResponse> {
    const item = await this.carritoRepository.findOne({
      where: { id_carrito_prod: id }
    });

    if (!item) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }

    if (updateCarritoDto.cantidad && updateCarritoDto.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    // Actualizar solo los campos permitidos
    if (updateCarritoDto.cantidad) {
      item.cantidad = updateCarritoDto.cantidad;
    }

    const updated = await this.carritoRepository.save(item);
    return this.buildCarritoItemResponse(updated);
  }

  async updateQuantity(id: number, cantidad: number): Promise<CarritoItemResponse> {
    if (cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const item = await this.carritoRepository.findOne({
      where: { id_carrito_prod: id }
    });

    if (!item) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }

    item.cantidad = cantidad;
    const updated = await this.carritoRepository.save(item);
    return this.buildCarritoItemResponse(updated);
  }

  async remove(id: number): Promise<void> {
    const item = await this.carritoRepository.findOne({
      where: { id_carrito_prod: id }
    });

    if (!item) {
      throw new NotFoundException(`Item de carrito con ID ${id} no encontrado`);
    }

    await this.carritoRepository.remove(item);
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    const items = await this.carritoRepository.find({
      where: {
        usuario: { id_usuario: userId },
        id_producto: productId
      }
    });

    if (items.length === 0) {
      throw new NotFoundException('Producto no encontrado en el carrito');
    }

    await this.carritoRepository.remove(items);
  }

  async clearCart(userId: number, carritoId?: number): Promise<void> {
    const whereCondition: any = {
      usuario: { id_usuario: userId }
    };

    if (carritoId) {
      whereCondition.id_carrito = carritoId;
    }

    const items = await this.carritoRepository.find({
      where: whereCondition
    });

    if (items.length > 0) {
      await this.carritoRepository.remove(items);
    }
  }

  async getCartItemCount(userId: number): Promise<number> {
    const result = await this.carritoRepository
      .createQueryBuilder('carrito')
      .select('SUM(carrito.cantidad)', 'total')
      .where('carrito.usuario = :userId', { userId })
      .getRawOne();

    return parseInt(result.total) || 0;
  }

  async moveToNewCart(userId: number): Promise<number> {
    // Crear nuevo carrito y mover items actuales
    const newCarritoId = await this.generateNewCarritoId();
    
    await this.carritoRepository
      .createQueryBuilder()
      .update(Carrito)
      .set({ id_carrito: newCarritoId })
      .where('usuario = :userId', { userId })
      .execute();

    return newCarritoId;
  }

  private async getOrCreateCarritoId(userId: number): Promise<number> {
    // Buscar carrito activo
    const activeCart = await this.carritoRepository.findOne({
      where: { usuario: { id_usuario: userId } },
      order: { id_carrito_prod: 'DESC' }
    });

    if (activeCart) {
      return activeCart.id_carrito;
    }

    // Crear nuevo carrito
    return this.generateNewCarritoId();
  }

  private async getActiveCarritoId(userId: number): Promise<number | null> {
    const activeCart = await this.carritoRepository.findOne({
      where: { usuario: { id_usuario: userId } },
      order: { id_carrito_prod: 'DESC' }
    });

    return activeCart ? activeCart.id_carrito : null;
  }

  private async generateNewCarritoId(): Promise<number> {
    // Generar ID único para el carrito basado en timestamp
    return Date.now();
  }

  private groupByCarrito(items: Carrito[]): Record<number, Carrito[]> {
    return items.reduce((groups, item) => {
      const key = item.id_carrito;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<number, Carrito[]>);
  }

  private async buildCarritoSummary(
    carritoId: number, 
    userId: number, 
    items: Carrito[]
  ): Promise<CarritoSummaryResponse> {
    const carritoItems = items.map(item => this.buildCarritoItemResponse(item));
    
    return {
      id_carrito: carritoId,
      id_usuario: userId,
      items: carritoItems,
      total_items: items.reduce((sum, item) => sum + item.cantidad, 0),
      fecha_creacion: new Date(), // Podrías agregar este campo a la entidad
      fecha_actualizacion: new Date(),
    };
  }

  private buildCarritoItemResponse(carrito: Carrito): CarritoItemResponse {
    return {
      id_carrito_prod: carrito.id_carrito_prod,
      id_carrito: carrito.id_carrito,
      id_producto: carrito.id_producto,
      cantidad: carrito.cantidad,
      usuario: carrito.usuario,
      // El producto_info se podría completar con joins a las tablas de productos
    };
  }
}