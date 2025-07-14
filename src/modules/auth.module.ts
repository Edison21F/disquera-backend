import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UsersModule } from '../modules/users.module'; // Cambiar a users.module
import { EstadosModule } from '../modules/estados.module'; // Agregar
import { RolesModule } from '../modules/roles.module'; // Agregar
import { JwtStrategy } from '../lib/strategies/jwt.strategy';
import { LocalStrategy } from '../lib/strategies/local.strategy';
import { key } from '../key';

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
