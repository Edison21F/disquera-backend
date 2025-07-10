import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './config/logging.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    logger.info('🚀 Iniciando aplicación NestJS...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Habilitar todos los niveles
    });

    // Pipes globales
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    // CORS si es necesario
    app.enableCors();

    const port = process.env.PORT ?? 3000;
    
    await app.listen(port);
    
    logger.info(`🎯 Aplicación corriendo en puerto ${port}`);
    logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    
    console.log(`🚀 Servidor iniciado en: http://localhost:${port}`);
    
  } catch (error) {
    logger.error('💥 Error al iniciar la aplicación:', error);
    console.error('💥 Error al iniciar:', error);
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('🚫 Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('🚫 Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();