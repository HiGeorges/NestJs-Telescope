import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelescopeModule } from '@telescope/core';

@Module({
  imports: [
    TelescopeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
