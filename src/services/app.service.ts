import { Injectable } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { RolesService } from './roles.service';
import { GenerosService } from './generos.service';
import { PaisesService } from './paises.service';
import { SexosService } from './sexos.service';

@Injectable()
export class AppService {
  constructor(
    private readonly estadosService: EstadosService,
    private readonly rolesService: RolesService,
    private readonly generosService: GenerosService,
    private readonly paisesService: PaisesService,
    private readonly sexosService: SexosService,
  ) {}

  getHello(): string {
    return 'API de Disquera funcionando correctamente!';
  }

  async initializeDatabase() {
    try {
      await Promise.all([
        this.estadosService.initializeDefaultStates(),
        this.rolesService.initializeDefaultRoles(),
        this.generosService.initializeDefaultGeneros(),
        this.paisesService.initializeDefaultCountries(),
        this.sexosService.initializeDefaultOptions(),
      ]);
      
      return {
        message: 'Base de datos inicializada correctamente',
        initialized: [
          'Estados',
          'Roles', 
          'Géneros',
          'Países',
          'Opciones de género'
        ]
      };
    } catch (error) {
      return {
        message: 'Error inicializando la base de datos',
        error: error.message
      };
    }
  }
}