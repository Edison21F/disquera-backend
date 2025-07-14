// src/common/middleware/logging.middleware.ts (VERSIÓN MEJORADA)
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger, performanceLogger } from '../../config/logging.config';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url, ip, headers } = req;
    const requestId = this.generateRequestId();
    
    // Agregar ID de request para tracking
    req['requestId'] = requestId;
    
    // Log de request entrante
    logger.info(`🔵 ${method} ${url}`, {
      requestId,
      ip,
      userAgent: headers['user-agent'],
      contentType: headers['content-type'],
      contentLength: headers['content-length'],
      timestamp: new Date().toISOString(),
      body: this.sanitizeRequestBody(req.body),
      query: req.query,
      params: req.params,
    });

    // Interceptar la respuesta
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Variable para capturar el cuerpo de la respuesta
    let responseBody: any;
    
    res.send = function(body) {
      responseBody = body;
      return originalSend.call(this, body);
    };
    
    res.json = function(body) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    // Cuando la respuesta termine
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      
      const logData = {
        requestId,
        statusCode,
        duration: `${duration}ms`,
        ip,
        contentLength: res.get('content-length'),
        userAgent: headers['user-agent'],
      };

      // Log según el tipo de respuesta
      if (statusCode >= 500) {
        logger.error(`🔴 ${method} ${url} - ${statusCode} - ${duration}ms`, {
          ...logData,
          responseBody: this.sanitizeResponseBody(responseBody, statusCode),
          level: 'CRITICAL_ERROR',
        });
      } else if (statusCode >= 400) {
        logger.warn(`🟡 ${method} ${url} - ${statusCode} - ${duration}ms`, {
          ...logData,
          responseBody: this.sanitizeResponseBody(responseBody, statusCode),
          level: 'CLIENT_ERROR',
        });
      } else if (statusCode >= 300) {
        logger.info(`🔵 ${method} ${url} - ${statusCode} - ${duration}ms`, {
          ...logData,
          level: 'REDIRECT',
        });
      } else {
        logger.info(`🟢 ${method} ${url} - ${statusCode} - ${duration}ms`, {
          ...logData,
          level: 'SUCCESS',
        });
      }

      // Log de performance para requests lentos
      if (duration > 2000) { // Más de 2 segundos
        performanceLogger.warn('Slow request detected', {
          ...logData,
          threshold: '2000ms',
          endpoint: `${method} ${url}`,
          severity: duration > 5000 ? 'HIGH' : 'MEDIUM',
        });
      }

      // Log de memoria para requests pesados
      if (duration > 1000) {
        const memoryUsage = process.memoryUsage();
        performanceLogger.info('Memory usage after heavy request', {
          requestId,
          endpoint: `${method} ${url}`,
          duration: `${duration}ms`,
          memory: {
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          },
        });
      }
    });

    // Manejar errores en el stream de respuesta
    res.on('error', (error) => {
      logger.error(`💥 Response stream error for ${method} ${url}`, {
        requestId,
        error: error.message,
        stack: error.stack,
        ip,
      });
    });

    // Timeout para requests muy largos
    const timeout = setTimeout(() => {
      logger.error(`⏰ Request timeout for ${method} ${url}`, {
        requestId,
        ip,
        duration: `${Date.now() - start}ms`,
        status: 'TIMEOUT',
      });
    }, 30000); // 30 segundos

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    next();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    
    const sensitiveFields = [
      'password', 'contraseña', 'token', 'secret', 'authorization',
      'creditCard', 'ssn', 'pin', 'cvv', 'apiKey'
    ];
    
    const sanitized = { ...body };
    
    const sanitizeRecursive = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeRecursive(item));
      }
      
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeRecursive(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };
    
    return sanitizeRecursive(sanitized);
  }

  private sanitizeResponseBody(body: any, statusCode: number): any {
    if (!body) return body;
    
    // Solo loggear el cuerpo completo para errores
    if (statusCode >= 400) {
      try {
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        
        // Limitar el tamaño del log
        const bodyStr = JSON.stringify(parsed);
        if (bodyStr.length > 1000) {
          return bodyStr.substring(0, 1000) + '... [TRUNCATED]';
        }
        
        return parsed;
      } catch {
        // Si no se puede parsear, devolver string truncado
        const bodyStr = body.toString();
        return bodyStr.length > 500 ? bodyStr.substring(0, 500) + '... [TRUNCATED]' : bodyStr;
      }
    }
    
    // Para respuestas exitosas, solo loggear metadata básica
    return {
      type: typeof body,
      length: body?.length || body?.toString?.()?.length || 'unknown',
    };
  }
}