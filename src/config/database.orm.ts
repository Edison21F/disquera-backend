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
  // Configuración de producción recomendada:
  synchronize: key.app.env === 'development', // Solo en desarrollo
  dropSchema: false,
  logging: key.app.env === 'development' ? 'all' : ['error'], // Logging según ambiente
  
  // Opciones adicionales para MySQL
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  
  // Para debugging y mejor manejo
  autoLoadEntities: true,
  retryAttempts: 3,
  retryDelay: 3000,  
};

// Configuración alternativa solo para recrear la base desde cero (USAR CON CUIDADO)
export const typeOrmConfigReset: TypeOrmModuleOptions = {
  ...typeOrmConfig,
  synchronize: true,
  logging: true,
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