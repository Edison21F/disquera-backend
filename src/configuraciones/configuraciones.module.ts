import { Module } from '@nestjs/common';
import { ConfiguracionesService } from './configuraciones.service';
import { ConfiguracionesController } from './configuraciones.controller';

@Module({
  controllers: [ConfiguracionesController],
  providers: [ConfiguracionesService],
})
export class ConfiguracionesModule {}
