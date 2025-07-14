import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';

@Module({
  imports: [TypeOrmModule.forFeature([]), MongooseModule.forFeature([])],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}