// src/config/logging.config.ts (VERSIÓN MEJORADA)

import * as winston from 'winston';
import * as moment from 'moment-timezone';
import * as fs from 'fs';
import * as path from 'path';
import { key } from '../key';

const logsDir = path.join(__dirname, '../../logs');

// Crea la carpeta "logs" si no existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Formato de hora en zona horaria Ecuador
const ecuadorTime = () => moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');

// Formato personalizado para los logs
const logFormat = winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}] ${message}`;
  
  if (stack) {
    msg += `\nStack: ${stack}`;
  }

  if (metadata && Object.keys(metadata).length) {
    msg += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
  }

  return msg;
});

// Formato compacto para errores críticos
const errorFormat = winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
  const basic = `${timestamp} [${level.toUpperCase()}] ${message}`;
  
  if (level === 'error' && stack) {
    return `${basic}\n${stack}\n${'-'.repeat(80)}`;
  }
  
  if (metadata && Object.keys(metadata).length) {
    return `${basic}\n${JSON.stringify(metadata, null, 2)}\n${'-'.repeat(40)}`;
  }
  
  return basic;
});

// Crear el logger principal
export const logger = winston.createLogger({
  level: key.app.env === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: ecuadorTime }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Archivo principal - TODOS los logs
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      level: 'debug',
      handleExceptions: true,
      handleRejections: true,
      maxsize: 20 * 1024 * 1024, // 20MB por archivo
      maxFiles: 10, // Mantener 10 archivos rotados
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: ecuadorTime }),
        logFormat
      )
    }),
    
    // Archivo específico para errores
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp({ format: ecuadorTime }),
        errorFormat
      )
    }),

    // Archivo para requests HTTP
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      level: 'info',
      maxsize: 15 * 1024 * 1024, // 15MB
      maxFiles: 7,
      format: winston.format.combine(
        winston.format.timestamp({ format: ecuadorTime }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          if (typeof message === 'string' && (message.includes('🔵') || message.includes('🟢') || message.includes('🔴'))) {
            return `${timestamp} ${message}${meta && Object.keys(meta).length ? ' | ' + JSON.stringify(meta) : ''}`;
          }
          return ''; // Filtrar solo requests HTTP, pero siempre retorna string
        }),
        winston.format((info) => info.message ? info : false)()
      )
    })
  ],
  exitOnError: false,
  
  // Capturar excepciones no manejadas
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      handleExceptions: true,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
      format: winston.format.combine(
        winston.format.timestamp({ format: ecuadorTime }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp} [UNCAUGHT EXCEPTION] ${message}\n${stack}\n${'='.repeat(100)}`;
        })
      )
    })
  ],
  
  // Capturar promesas rechazadas
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      handleRejections: true,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
      format: winston.format.combine(
        winston.format.timestamp({ format: ecuadorTime }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp} [UNHANDLED REJECTION] ${message}\n${stack}\n${'='.repeat(100)}`;
        })
      )
    })
  ]
});

// Solo mostrar en consola si NO está en producción
if (key.app.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: ecuadorTime }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let output = `${timestamp} ${level}: ${message}`;
          if (Object.keys(meta).length) {
            output += `\n${JSON.stringify(meta, null, 2)}`;
          }
          return output;
        })
      ),
    })
  );
}

// Logger específico para errores de base de datos
export const dbLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: ecuadorTime }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let logMsg = `${timestamp} [DATABASE-${level.toUpperCase()}] ${message}`;
      
      if (stack) {
        logMsg += `\nStack: ${stack}`;
      }
      
      if (meta && Object.keys(meta).length) {
        logMsg += `\nDatabase Details: ${JSON.stringify(meta, null, 2)}`;
      }
      
      return logMsg + '\n' + '-'.repeat(80);
    })
  ),
  transports: [
    // Archivo específico para base de datos
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      level: 'debug',
      maxsize: 15 * 1024 * 1024,
      maxFiles: 5,
    }),
    
    // También en el archivo principal
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      level: 'error' // Solo errores de DB en app.log
    })
  ]
});

// Logger para performance y métricas
export const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: ecuadorTime }),
    winston.format.printf(({ timestamp, message, ...meta }) => {
      return `${timestamp} [PERFORMANCE] ${message} | ${JSON.stringify(meta)}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3,
    })
  ]
});

// Interceptar console.log, console.error, etc. para redirigir a archivos
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  debug: console.debug,
  info: console.info
};

// Solo interceptar en producción
if (key.app.env === 'production') {
  console.log = (...args) => {
    logger.info(args.join(' '));
  };

  console.error = (...args) => {
    logger.error(args.join(' '));
  };

  console.warn = (...args) => {
    logger.warn(args.join(' '));
  };

  console.debug = (...args) => {
    logger.debug(args.join(' '));
  };

  console.info = (...args) => {
    logger.info(args.join(' '));
  };
}

// Función para loggear el inicio de la aplicación
export const logAppStart = () => {
  logger.info('🚀 Aplicación iniciando...', {
    environment: key.app.env,
    pid: key.app.pid,
    nodeVersion: process.version,
    platform: process.platform,
    memory: process.memoryUsage(),
  });
};

// Función para loggear el cierre de la aplicación
export const logAppShutdown = (signal?: string) => {
  logger.info('🛑 Aplicación cerrándose...', {
    signal: signal || 'UNKNOWN',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
};

// Restaurar console original si es necesario
export const restoreConsole = () => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.debug = originalConsole.debug;
  console.info = originalConsole.info;
};

// Manejo de señales del proceso
process.on('SIGTERM', () => {
  logAppShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  logAppShutdown('SIGINT');
});

// Log de memoria cada 30 minutos en producción
if (key.app.env === 'production') {
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    if (memoryUsage.heapUsed > 500 * 1024 * 1024) { // Si usa más de 500MB
      performanceLogger.warn('Alto uso de memoria detectado', {
        memory: memoryUsage,
        uptime: process.uptime(),
      });
    } 
  }, 30 * 60 * 1000); // 30 minutos
}