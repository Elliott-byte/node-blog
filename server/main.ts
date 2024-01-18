import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import express from 'express';
import { APP_SERVER } from './config/index.config';
import { assetsPath, staticAssetsPath } from './utils/path.util';
export async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );
    app.use(express.json({ limit: '20mb' }));
    app.useStaticAssets(assetsPath, { prefix: '/static/' });
    app.useStaticAssets(staticAssetsPath, { prefix: '/static/' });
    return await app.listen(APP_SERVER.port);
}
bootstrap();
