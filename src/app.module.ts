// src/app.module.ts (VERSIÓN ACTUALIZADA)
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HealthModule } from './common/health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.orm';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/database.mongo';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistasModule } from './artistas/artistas.module';
import { AlbumsModule } from './albums/albums.module';
import { CancionesModule } from './canciones/canciones.module';
import { GenerosModule } from './generos/generos.module';
import { EventosModule } from './eventos/eventos.module';
import { ManagersModule } from './managers/managers.module';
import { VentasModule } from './ventas/ventas.module';
import { CarritosModule } from './carritos/carritos.module';
import { TransaccionesModule } from './transacciones/transacciones.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { ResenasModule } from './resenas/resenas.module';
import { EstadosModule } from './estados/estados.module';
import { RolesModule } from './roles/roles.module';
import { PaisesModule } from './paises/paises.module';
import { SexosModule } from './sexos/sexos.module';
import { MetodosPagosModule } from './metodos-pagos/metodos-pagos.module';
import { PromocionesModule } from './promociones/promociones.module';


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