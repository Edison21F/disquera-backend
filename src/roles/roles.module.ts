// src/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Rol } from '../models/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // Exportamos para usar en otros módulos
})

export class RolesModule {}