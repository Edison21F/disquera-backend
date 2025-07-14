// src/app.module.ts (VERSIÓN ACTUALIZADA)
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggingMiddleware } from '../lib/middleware/logging.middleware';
import { AllExceptionsFilter } from '../lib/filters/all-exceptions.filter';
import { HealthModule } from './health.module';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/database.orm';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from '../config/database.mongo';
import { AuthModule } from './auth.module';
import { UsersModule } from '../modules/users.module';
import { ArtistasModule } from './artistas.module';
import { AlbumsModule } from './albums.module';
import { CancionesModule } from './canciones.module';
import { GenerosModule } from '../modules/generos.module';
import { EventosModule } from './eventos.module';
import { ManagersModule } from '../modules/managers.module';
import { VentasModule } from '../modules/ventas.module';
import { CarritosModule } from './carritos.module';
import { TransaccionesModule } from '../modules/transacciones.module';
import { FavoritosModule } from './favoritos.module';
import { ComentariosModule } from '../modules/comentarios.module';
import { ResenasModule } from '../modules/resenas.module';
import { EstadosModule } from '../modules/estados.module';
import { RolesModule } from '../modules/roles.module';
import { PaisesModule } from '../modules/paises.module';
import { SexosModule } from '../modules/sexos.module';
import { MetodosPagosModule } from '../modules/metodos-pagos.module';
import { PromocionesModule } from '../modules/promociones.module';


@Module({
  imports: [
    // Configuración de base de datos con logging mejorado
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRootAsync({
      useFactory: () => mongooseConfig
    }),
    
    // Módulo de health check
    HealthModule,
    
    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    ArtistasModule,
    AlbumsModule,
    CancionesModule,
    GenerosModule,
    EventosModule,
    ManagersModule,
    VentasModule,
    CarritosModule,
    TransaccionesModule,
    FavoritosModule,
    ComentariosModule,
    ResenasModule,
    EstadosModule,
    RolesModule,
    PaisesModule,
    SexosModule,
    MetodosPagosModule,
    PromocionesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Filtro global de excepciones
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*'); // Aplicar a todas las rutas
  }
}