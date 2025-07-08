import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.orm';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/database.mongo';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRootAsync({
      useFactory:() => mongooseConfig
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
