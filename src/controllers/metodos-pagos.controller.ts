import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards 
} from '@nestjs/common';
import { MetodosPagosService } from '../services/metodos-pagos.service';
import { CreateMetodosPagoDto } from '../dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from '../dto/update-metodos-pago.dto';

@Controller('metodos-pagos')
export class MetodosPagosController {
  constructor(private readonly metodosPagosService: MetodosPagosService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  create(@Body() createMetodosPagoDto: CreateMetodosPagoDto) {
    return this.metodosPagosService.create(createMetodosPagoDto);
  }

  @Get()
  findAll() {
    return this.metodosPagosService.findAll();
  }

  @Get('active')
  findActive() {
    return this.metodosPagosService.findActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMetodosPagoDto: UpdateMetodosPagoDto
  ) {
    return this.metodosPagosService.update(id, updateMetodosPagoDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagosService.remove(id);
  }

  @Post('initialize')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  initializeMethods() {
    return this.metodosPagosService.initializeDefaultMethods();
  }
}