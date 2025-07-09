import { Injectable } from '@nestjs/common';
import { CreateConfiguracioneDto } from './dto/create-configuracione.dto';
import { UpdateConfiguracioneDto } from './dto/update-configuracione.dto';

@Injectable()
export class ConfiguracionesService {
  create(createConfiguracioneDto: CreateConfiguracioneDto) {
    return 'This action adds a new configuracione';
  }

  findAll() {
    return `This action returns all configuraciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configuracione`;
  }

  update(id: number, updateConfiguracioneDto: UpdateConfiguracioneDto) {
    return `This action updates a #${id} configuracione`;
  }

  remove(id: number) {
    return `This action removes a #${id} configuracione`;
  }
}
