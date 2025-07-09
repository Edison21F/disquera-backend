import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracioneDto } from './create-configuracione.dto';

export class UpdateConfiguracioneDto extends PartialType(CreateConfiguracioneDto) {}
