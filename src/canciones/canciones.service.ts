import { Injectable } from '@nestjs/common';
import { CreateCancioneDto } from './dto/create-cancione.dto';
import { UpdateCancioneDto } from './dto/update-cancione.dto';

@Injectable()
export class CancionesService {
  create(createCancioneDto: CreateCancioneDto) {
    return 'This action adds a new cancione';
  }

  findAll() {
    return `This action returns all canciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cancione`;
  }

  update(id: number, updateCancioneDto: UpdateCancioneDto) {
    return `This action updates a #${id} cancione`;
  }

  remove(id: number) {
    return `This action removes a #${id} cancione`;
  }
}
