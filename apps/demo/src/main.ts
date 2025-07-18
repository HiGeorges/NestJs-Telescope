import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  TelescopeModule.setup(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
