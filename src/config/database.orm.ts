import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { key } from './key';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: key.db.host,
  port: key.db.port,
  username: key.db.user,
  password: key.db.password,
  database: key.db.database,
  entities: [
    __dirname + '/../models/entities/*.entity.{ts,js}',
    
  ],
  synchronize: true, // Solo para desarrollo
  dropSchema: false, // Cambiado a false para evitar pérdida de datos
};

// Configuración para migraciones
export const typeOrmCliConfig = {
  ...typeOrmConfig,
  migrations: ['src/db/migrations/*.ts'],
  subscribers: ['src/db/subscribers/*.ts']
};