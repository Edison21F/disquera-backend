import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { InjectConnection as InjectMongoConnection } from '@nestjs/mongoose';
import { Connection } from 'typeorm';
import { Connection as MongoConnection } from 'mongoose';
import { logger, performanceLogger } from '../../config/logging.config';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly dbConnection: Connection,
    @InjectMongoConnection() private readonly mongoConnection: MongoConnection,
  ) {}

  async getHealthStatus() {
    const startTime = Date.now();
    
    try {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      };

      const duration = Date.now() - startTime;
      
      logger.info('🏥 Health check realizado', {
        status: health.status,
        duration: `${duration}ms`,
        uptime: health.uptime,
      });

      return health;
    } catch (error) {
      logger.error('❌ Error en health check', {
        error: error.message,
        stack: error.stack,
        duration: `${Date.now() - startTime}ms`,
      });
      
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  async getDetailedHealthStatus() {
    const startTime = Date.now();
    
    try {
      const [dbStatus, mongoStatus, memoryStatus] = await Promise.all([
        this.checkDatabaseConnection(),
        this.checkMongoConnection(),
        this.checkMemoryUsage(),
      ]);

      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: dbStatus,
          mongodb: mongoStatus,
          memory: memoryStatus,
        },
        system: {
          platform: process.platform,
          nodeVersion: process.version,
          pid: process.pid,
        }
      };

      const overallStatus = this.determineOverallStatus([dbStatus, mongoStatus, memoryStatus]);
      health.status = overallStatus;

      const duration = Date.now() - startTime;

      if (overallStatus !== 'ok') {
        logger.warn('⚠️ Health check con problemas', {
          status: overallStatus,
          services: health.services,
          duration: `${duration}ms`,
        });
      } else {
        logger.info('✅ Health check detallado completado', {
          status: overallStatus,
          duration: `${duration}ms`,
        });
      }

      return health;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('💥 Error crítico en health check detallado', {
        error: error.message,
        stack: error.stack,
        duration: `${duration}ms`,
      });
      
      return {
        status: 'critical',
        timestamp: new Date().toISOString(),
        error: error.message,
        uptime: process.uptime(),
      };
    }
  }

  private async checkDatabaseConnection(): Promise<any> {
    try {
      const startTime = Date.now();
      await this.dbConnection.query('SELECT 1');
      const duration = Date.now() - startTime;
      
      const status = {
        status: 'ok',
        responseTime: `${duration}ms`,
        connection: 'active',
      };

      if (duration > 1000) {
        logger.warn('🐌 Conexión lenta a MySQL detectada', {
          duration: `${duration}ms`,
          threshold: '1000ms',
        });
        status.status = 'slow';
      }

      return status;
    } catch (error) {
      logger.error('❌ Error de conexión con MySQL', {
        error: error.message,
        code: error.code,
      });
      
      return {
        status: 'error',
        error: error.message,
        connection: 'failed',
      };
    }
  }

  private async checkMongoConnection(): Promise<any> {
    try {
      const startTime = Date.now();
      if (!this.mongoConnection.db) {
        throw new Error('MongoDB connection is not initialized');
      }
      await this.mongoConnection.db.admin().ping();
      const duration = Date.now() - startTime;
      
      const status = {
        status: 'ok',
        responseTime: `${duration}ms`,
        connection: 'active',
        readyState: this.mongoConnection.readyState,
      };

      if (duration > 1000) {
        logger.warn('🐌 Conexión lenta a MongoDB detectada', {
          duration: `${duration}ms`,
          threshold: '1000ms',
        });
        status.status = 'slow';
      }

      return status;
    } catch (error) {
      logger.error('❌ Error de conexión con MongoDB', {
        error: error.message,
        readyState: this.mongoConnection.readyState,
      });
      
      return {
        status: 'error',
        error: error.message,
        connection: 'failed',
        readyState: this.mongoConnection.readyState,
      };
    }
  }

  private checkMemoryUsage(): any {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const usagePercentage = (usedMemory / totalMemory) * 100;

    const status = {
      status: 'ok',
      heapUsed: `${Math.round(usedMemory / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(totalMemory / 1024 / 1024)}MB`,
      usage: `${usagePercentage.toFixed(1)}%`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
    };

    if (usagePercentage > 85) {
      logger.warn('🚨 Alto uso de memoria detectado', {
        usage: `${usagePercentage.toFixed(1)}%`,
        heapUsed: status.heapUsed,
        heapTotal: status.heapTotal,
      });
      status.status = 'warning';
    } else if (usagePercentage > 95) {
      logger.error('💥 Uso crítico de memoria', {
        usage: `${usagePercentage.toFixed(1)}%`,
        heapUsed: status.heapUsed,
        heapTotal: status.heapTotal,
      });
      status.status = 'critical';
    }

    return status;
  }

  private determineOverallStatus(serviceStatuses: any[]): string {
    const statuses = serviceStatuses.map(service => service.status);
    
    if (statuses.includes('critical') || statuses.includes('error')) {
      return 'error';
    }
    
    if (statuses.includes('warning') || statuses.includes('slow')) {
      return 'warning';
    }
    
    return 'ok';
  }
}