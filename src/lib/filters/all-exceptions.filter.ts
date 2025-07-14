// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger, dbLogger } from '../../config/logging.config';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errorDetails: any = {};

    // Determinar el tipo de error y extraer información
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || 'Error HTTP';
      
      if (typeof exceptionResponse === 'object') {
        errorDetails = exceptionResponse;
      }
    } else if (exception instanceof QueryFailedError) {
      // Errores específicos de base de datos
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error de base de datos';
      errorDetails = {
        query: exception.query,
        parameters: exception.parameters,
        driverError: exception.driverError,
      };
      
      // Log específico para errores de DB
      dbLogger.error('Error de consulta en base de datos', {
        query: exception.query,
        parameters: exception.parameters,
        error: exception.message,
        stack: exception.stack,
        url: request.url,
        method: request.method,
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      });
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Error interno del servidor';
      errorDetails = {
        name: exception.name,
        stack: exception.stack,
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error desconocido';
      errorDetails = { exception };
    }

    // Preparar información del contexto
    const errorContext = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: message,
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      body: this.sanitizeBody(request.body),
      query: request.query,
      params: request.params,
      headers: this.sanitizeHeaders(request.headers),
      ...errorDetails,
    };

    // Log del error
    if (status >= 500) {
      logger.error(`🔴 ERROR ${status} - ${message}`, {
        ...errorContext,
        stack: (exception as Error).stack,
      });
    } else if (status >= 400) {
      logger.warn(`🟡 CLIENT ERROR ${status} - ${message}`, errorContext);
    }

    // Respuesta al cliente
    const errorResponse = {
      statusCode: status,
      timestamp: errorContext.timestamp,
      path: request.url,
      method: request.method,
      message,
      ...(process.env.NODE_ENV === 'development' && { 
        details: errorDetails,
        stack: (exception as Error).stack 
      }),
    };

    response.status(status).json(errorResponse);
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sensitiveFields = ['password', 'contraseña', 'token', 'secret', 'authorization'];
    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitized = { ...headers };
    
    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}