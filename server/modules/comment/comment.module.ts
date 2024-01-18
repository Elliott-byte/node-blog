import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ArticleModelModule } from '@blog/server/models/article.model';
import { CommentModelModule } from '@blog/server/models/comment.model';
import { UserModelModule } from '@blog/server/models/user.model';

@Module({
    providers: [CommentService],
    controllers: [CommentController],
    imports: [ArticleModelModule, CommentModelModule, UserModelModule],
    exports: [],
})
export class CommentModule {}
