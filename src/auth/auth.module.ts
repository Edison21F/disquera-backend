import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EstadosModule } from '../estados/estados.module'; // Agregar
import { RolesModule } from '../roles/roles.module'; // Agregar
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { key } from '../config/key';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    EstadosModule, // Importar el módulo de estados
    RolesModule, // Importar el módulo de roles
    JwtModule.register({
      secret: key.jwt.secret,
      signOptions: { expiresIn: key.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
