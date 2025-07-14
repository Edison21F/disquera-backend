import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagersService } from '../services/managers.service';
import { ManagersController } from '../controllers/managers.controller';
import { Manager } from '../models/entities/managers.entity';
import { ManagerMetadataSchema } from '../models/schemas/manager-metadata.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manager]),
    MongooseModule.forFeature([
      { name: 'ManagerMetadata', schema: ManagerMetadataSchema }
    ]),
  ],
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService],
})
export class ManagersModule {}