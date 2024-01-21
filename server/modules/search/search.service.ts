import { Article, ArticleDocument } from '@blog/server/models/article.model';
import { IPaginate } from '@blog/server/mongoose/paginate';
import { QueryRules } from '@blog/server/utils/mongoose.query.util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SearchService {
    constructor(@InjectModel(Article.name) private readonly articleModel: Model<ArticleDocument> & IPaginate) {}

    public async searchArticleList(options: { key?: string }): Promise<{ items: Article[]; totalCount: number }> {
        if (options.key) {
            const q = new QueryRules(options, {
                key: (str: string) => ({ title: new RegExp(str) }),
            }).generateQuery();
            return await this.articleModel.paginate({ ...q, isDeleted: false }, 'title', {
                page: 1,
                limit: 20,
            });
        }
        const items = await this.articleModel.aggregate([
            {
                $sample: { size: 4 },
            },
            {
                $project: { title: 1 },
            },
        ]);
        return {
            items,
            totalCount: items.length,
        };
    }
}
