import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB } from './config/index.config';
import { CategoryModule } from '@blog/server/modules/category/category.module';
import { ArticleModule } from '@blog/server/modules/article/article.module';
import { AdminLogModule } from '@blog/server/modules/adminlog/adminlog.module';
import { DynamicConfigModule } from './modules/dynamic-config/dynamic.module';
import { CommentModule } from './modules/comment/comment.module';
import { LoginModule } from './modules/login/login.module';
import { DraftModule } from './modules/draft/draft.module';
import { FileModule } from './modules/file/file.module';

@Module({
    imports: [
        MongooseModule.forRoot(MONGODB.uri),
        UserModule,
        CategoryModule,
        ArticleModule,
        AdminLogModule,
        DynamicConfigModule,
        CommentModule,
        LoginModule,
        DraftModule,
        FileModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
