import { Module } from '@nestjs/common';
import { ArticleController } from '@blog/server/modules/article/article.controller';
import { ArticleService } from '@blog/server/modules/article/article.service';
import { ArticleModelModule } from '@blog/server/models/article.model';
import { CategoryModelModule } from '@blog/server/models/category.model';
import { DraftModelModule } from '@blog/server/models/draft.model';

@Module({
    imports: [ArticleModelModule, CategoryModelModule, DraftModelModule],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
