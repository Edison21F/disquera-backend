// ===== ROLES MODULE =====

// src/roles/dto/create-role.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  nombre_rol: string;

  @IsOptional()
  @IsString()
  description?: string;
}
