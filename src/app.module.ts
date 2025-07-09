import { Module } from '@nestjs/common';
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
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { EstadosModule } from './estados/estados.module';
import { RolesModule } from './roles/roles.module';
import { PaisesModule } from './paises/paises.module';
import { SexosModule } from './sexos/sexos.module';
import { MetodosPagosModule } from './metodos-pagos/metodos-pagos.module';
import { PromocionesModule } from './promociones/promociones.module';
import { ConfiguracionesModule } from './configuraciones/configuraciones.module';
import { ArtistasAdquiridosModule } from './artistas-adquiridos/artistas-adquiridos.module';
import { HistorialVentasModule } from './historial-ventas/historial-ventas.module';
import { EventMetadataModule } from './event-metadata/event-metadata.module';
import { UserProfilesModule } from './user-profiles/user-profiles.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRootAsync({
      useFactory:() => mongooseConfig
    }),
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
    NotificacionesModule,
    EstadosModule,
    RolesModule,
    PaisesModule,
    SexosModule,
    MetodosPagosModule,
    PromocionesModule,
    ConfiguracionesModule,
    ArtistasAdquiridosModule,
    HistorialVentasModule,
    EventMetadataModule,
    UserProfilesModule,
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
