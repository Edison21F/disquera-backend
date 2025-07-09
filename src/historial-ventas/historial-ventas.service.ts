import { Injectable } from '@nestjs/common';
import { CreateHistorialVentaDto } from './dto/create-historial-venta.dto';
import { UpdateHistorialVentaDto } from './dto/update-historial-venta.dto';

@Injectable()
export class HistorialVentasService {
  create(createHistorialVentaDto: CreateHistorialVentaDto) {
    return 'This action adds a new historialVenta';
  }

  findAll() {
    return `This action returns all historialVentas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialVenta`;
  }

  update(id: number, updateHistorialVentaDto: UpdateHistorialVentaDto) {
    return `This action updates a #${id} historialVenta`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialVenta`;
  }
}
