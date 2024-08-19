import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WORKER_SERVER_PORT } from 'src/common/config/app.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(WORKER_SERVER_PORT);
  Logger.verbose(`Worker server running on port: ${WORKER_SERVER_PORT}`);
}
bootstrap();
