// src/config/database.orm.ts (VERSIÓN MEJORADA)
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { key } from '../key';
import { DatabaseLogger } from './database-logger';

const isDevelopment = key.app.env === 'development';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: key.db.host,
  port: key.db.port,
  username: key.db.user,
  password: key.db.password,
  database: key.db.database,
  entities: [__dirname + '/../models/entities/*.entity.{ts,js}'],
  
  // Configuración de producción
  synchronize: isDevelopment, // Solo en desarrollo
  dropSchema: false,
  logger: new DatabaseLogger(),
  logging: isDevelopment ? ['error', 'warn', 'migration', 'schema'] : ['error'],
  
  // Opciones adicionales para MySQL
  extra: {
    charset: 'utf8mb4_unicode_ci',
    connectionLimit: 20,
    enableKeepAlive: true,
  },
  
  // Configuración para manejo de entidades y reintentos
  autoLoadEntities: true,
  retryAttempts: 3,
  retryDelay: 3000,
  
  // Configuración para queries lentas
  maxQueryExecutionTime: 5000, // Log queries que tomen más de 5 segundos
};

// Configuración alternativa para recrear la base desde cero (USAR CON CUIDADO)
export const typeOrmConfigReset: TypeOrmModuleOptions = {
  ...typeOrmConfig,
  synchronize: true,
  logging: 'all',
};

// Configuración para migraciones
export const typeOrmCliConfig = {
  ...typeOrmConfig,
  migrations: ['src/db/migrations/*.ts'],
  subscribers: ['src/db/subscribers/*.ts'],
  cli: {
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'src/db/subscribers',
  }
};
