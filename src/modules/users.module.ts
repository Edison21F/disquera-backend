import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { Usuario } from '../models/entities/users.entity';
import { PerfilUsuarioSchema } from '../models/schemas/userProfile.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    MongooseModule.forFeature([
      { name: 'PerfilUsuario', schema: PerfilUsuarioSchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos para usar en Auth
})
export class UsersModule {}
