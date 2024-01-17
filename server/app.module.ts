import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { assetsPath, staticAssetsPath } from './utils/path.util';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB } from './config/index.config';

@Module({
    imports: [
        MongooseModule.forRoot(MONGODB.uri),
        ServeStaticModule.forRoot(
            { rootPath: assetsPath, serveRoot: '/static' },
            {
                rootPath: staticAssetsPath,
                serveRoot: '/static',
            }
        ),
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
