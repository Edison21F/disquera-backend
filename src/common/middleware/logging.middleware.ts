import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logging.config';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url, ip, headers } = req;
    
    // Log de request
    logger.info(`🔵 ${method} ${url}`, {
      ip,
      userAgent: headers['user-agent'],
      timestamp: new Date().toISOString()
    });

    // Interceptar la respuesta
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - start;
      const { statusCode } = res;
      
      // Log de response
      if (statusCode >= 400) {
        logger.error(`🔴 ${method} ${url} - ${statusCode} - ${duration}ms`, {
          statusCode,
          duration,
          ip,
          responseBody: body?.toString().substring(0, 500)
        });
      } else {
        logger.info(`🟢 ${method} ${url} - ${statusCode} - ${duration}ms`, {
          statusCode,
          duration,
          ip
        });
      }
      
      return originalSend.call(this, body);
    };

    next();
  }
}