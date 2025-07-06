import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestTelescopeModule } from '@telescope/core';

@Module({
  imports: [
    NestTelescopeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
