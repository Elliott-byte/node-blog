import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { assetsPath, staticAssetsPath } from './utils/path.util';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB } from './config/index.config';
import { CategoryModule } from '@blog/server/modules/category/category.module';
import { ArticleModule } from '@blog/server/modules/article/article.module';
import { AdminLogModule } from '@blog/server/modules/adminlog/adminlog.module';
import { DynamicConfigModule } from './modules/dynamic-config/dynamic.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
    imports: [
        MongooseModule.forRoot(MONGODB.uri),
        UserModule,
        CategoryModule,
        ArticleModule,
        AdminLogModule,
        DynamicConfigModule,
        CommentModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
