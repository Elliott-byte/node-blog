import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import express from 'express';
import { APP_SERVER } from './config/index.config';
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(express.json({ limit: '20mb' }));
  return await app.listen(APP_SERVER.port);
}
bootstrap();
