import { Injectable } from '@nestjs/common';
import { CreatePromocioneDto } from './dto/create-promocione.dto';
import { UpdatePromocioneDto } from './dto/update-promocione.dto';

@Injectable()
export class PromocionesService {
  create(createPromocioneDto: CreatePromocioneDto) {
    return 'This action adds a new promocione';
  }

  findAll() {
    return `This action returns all promociones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promocione`;
  }

  update(id: number, updatePromocioneDto: UpdatePromocioneDto) {
    return `This action updates a #${id} promocione`;
  }

  remove(id: number) {
    return `This action removes a #${id} promocione`;
  }
}
