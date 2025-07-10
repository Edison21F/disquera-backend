// src/config/database-logger.ts
import { Logger } from 'typeorm';
import { dbLogger, logger } from './logging.config';

export class DatabaseLogger implements Logger {
  
  logQuery(query: string, parameters?: any[], queryRunner?: any): void {
    // Solo log en desarrollo para queries normales
    if (process.env.NODE_ENV === 'development') {
      logger.debug('🔵 DB QUERY', {
        query: this.formatQuery(query),
        parameters: this.sanitizeParameters(parameters),
        duration: queryRunner?.data?.duration || 'N/A',
      });
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: any): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    dbLogger.error('🔴 DB QUERY ERROR', {
      error: errorMessage,
      query: this.formatQuery(query),
      parameters: this.sanitizeParameters(parameters),
      stack: errorStack,
      duration: queryRunner?.data?.duration || 'N/A',
    });

    // También log en el logger principal para errores críticos
    logger.error('💥 Error crítico en base de datos', {
      error: errorMessage,
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      stack: errorStack,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: any): void {
    dbLogger.warn('🐌 SLOW DB QUERY', {
      duration: `${time}ms`,
      query: this.formatQuery(query),
      parameters: this.sanitizeParameters(parameters),
      threshold: 'Query took longer than expected',
    });

    // Log en el logger principal si es muy lenta (>5 segundos)
    if (time > 5000) {
      logger.warn('🚨 Query extremadamente lenta detectada', {
        duration: `${time}ms`,
        query: query.substring(0, 100) + '...',
      });
    }
  }

  logSchemaBuild(message: string, queryRunner?: any): void {
    logger.info('🏗️ DB SCHEMA BUILD', { message });
  }

  logMigration(message: string, queryRunner?: any): void {
    logger.info('📦 DB MIGRATION', { message });
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: any): void {
    switch (level) {
      case 'log':
      case 'info':
        logger.info('ℹ️ DB INFO', { message });
        break;
      case 'warn':
        logger.warn('⚠️ DB WARNING', { message });
        break;
    }
  }

  private formatQuery(query: string): string {
    // Limitar longitud de query para logs
    const maxLength = 500;
    if (query.length > maxLength) {
      return query.substring(0, maxLength) + '... [TRUNCATED]';
    }
    return query;
  }

  private sanitizeParameters(parameters?: any[]): any[] {
    if (!parameters) return [];
    
    return parameters.map(param => {
      if (typeof param === 'string' && param.length > 100) {
        return param.substring(0, 100) + '... [TRUNCATED]';
      }
      return param;
    });
  }
}