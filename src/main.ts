// src/main.ts (VERSIÓN MEJORADA)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, logAppStart, logAppShutdown } from './config/logging.config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  try {
    logAppStart();
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Filtro global de excepciones
    app.useGlobalFilters(new AllExceptionsFilter());

    // Pipes globales
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        logger.warn('🟡 Errores de validación en request', {
          errors: errors.map(error => ({
            property: error.property,
            value: error.value,
            constraints: error.constraints,
          })),
        });
        return new Error(`Errores de validación: ${errors.map(e => Object.values(e.constraints || {})).flat().join(', ')}`);
      },
    }));

    // CORS configurado para producción
    app.enableCors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://tu-dominio.com'] // Cambia por tu dominio real
        : ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Configuración de seguridad adicional
    app.setGlobalPrefix('api');

    const port = process.env.PORT ?? 3000;
    
    await app.listen(port);
    
    logger.info(`🎯 Aplicación corriendo en puerto ${port}`, {
      environment: process.env.NODE_ENV || 'development',
      url: `http://localhost:${port}`,
      apiPrefix: 'api',
    });
    
    console.log(`🚀 Servidor iniciado en: http://localhost:${port}/api`);
    
    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`📧 Señal ${signal} recibida, cerrando servidor...`);
      
      app.close().then(() => {
        logAppShutdown(signal);
        logger.info('✅ Servidor cerrado correctamente');
        process.exit(0);
      }).catch((error) => {
        logger.error('❌ Error durante el cierre del servidor', {
          error: error.message,
          stack: error.stack,
        });
        process.exit(1);
      });
    };

    // Escuchar señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Log de memoria inicial
    logger.info('📊 Estado inicial de memoria', {
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
    });
    
  } catch (error) {
    logger.error('💥 Error crítico al iniciar la aplicación', {
      error: error.message,
      stack: error.stack,
      environment: process.env.NODE_ENV,
    });
    console.error('💥 Error crítico al iniciar:', error);
    process.exit(1);
  }
}

// Manejar errores no capturados con logging detallado
process.on('unhandledRejection', (reason, promise) => {
  logger.error('🚫 Unhandled Promise Rejection detectada', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    promise: promise.toString(),
    location: 'process.unhandledRejection',
  });
  
  // En producción, cerrar el proceso después de loggear
  if (process.env.NODE_ENV === 'production') {
    setTimeout(() => {
      logger.error('🔥 Cerrando proceso debido a unhandled rejection');
      process.exit(1);
    }, 1000);
  }
});

process.on('uncaughtException', (error) => {
  logger.error('🚫 Uncaught Exception detectada', {
    error: error.message,
    stack: error.stack,
    name: error.name,
    location: 'process.uncaughtException',
  });
  
  console.error('🚫 Uncaught Exception:', error);
  
  // En caso de excepción no capturada, cerrar inmediatamente
  process.exit(1);
});

// Manejar warnings
process.on('warning', (warning) => {
  logger.warn('⚠️ Process Warning', {
    name: warning.name,
    message: warning.message,
    stack: warning.stack,
  });
});

// Monitoreo de memoria (solo en producción)
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Log solo si el uso de memoria es alto
    if (memoryUsage.heapUsed > 200 * 1024 * 1024) { // 200MB
      logger.warn('📈 Alto uso de memoria detectado', {
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        },
        cpu: cpuUsage,
        uptime: `${Math.round(process.uptime())}s`,
      });
    }
  }, 5 * 60 * 1000); // Cada 5 minutos
}

bootstrap();