import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelescopeModule } from 'nestjs-telescope';

@Module({
  imports: [TelescopeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
