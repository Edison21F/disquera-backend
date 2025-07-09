import { Module } from '@nestjs/common';
import { MetodosPagosService } from './metodos-pagos.service';
import { MetodosPagosController } from './metodos-pagos.controller';

@Module({
  controllers: [MetodosPagosController],
  providers: [MetodosPagosService],
})
export class MetodosPagosModule {}
