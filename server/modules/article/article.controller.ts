import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Roles } from '@blog/server/decorators/roles.decorator';
import {
  JoiBody,
  JoiParam,
  JoiQuery,
} from '@blog/server/decorators/joi.decorator';
import { Article, ArticleJoiSchema } from '@blog/server/models/article.model';
import {
  ObjectIdSchema,
  generateObjectIdsSchema,
} from '@blog/server/joi/schemas/object-id-schema';
import Joi from '@blog/server/joi';
import { StandardPaginationSchema } from '@blog/server/joi/schemas/standard-pagination-schema';

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('/articles')
  @Roles('admin')
  public async create(
    @JoiBody(ArticleJoiSchema, { method: 'post' }) article: Article,
  ) {
    return await this.articleService.create(article);
  }

  @Put('/articles/:id')
  @Roles('admin')
  public async update(
    @JoiParam(ObjectIdSchema) params: { id: string },
    @JoiBody(ArticleJoiSchema) article: Article,
  ) {
    return await this.articleService.update(params.id, article);
  }

  @Get('/articles')
  public async getArticles(
    @Req() req: Request,
    @JoiQuery({
      cid: Joi.objectId(),
      tag: Joi.string().max(20),
      title: Joi.string().trim().max(80),
      ...StandardPaginationSchema,
    })
    query: {
      page: number;
      limit: number;
      cid: string;
      tag: string;
      title: string;
    },
  ) {
    const { items, totalCount } =
      await this.articleService.getArticleList(query);
    return {
      items,
      totalCount,
    };
  }

  @Get('/recentArticles')
  public async getRecentArticles(): Promise<Article[]> {
    return await this.articleService.getRandomArticles();
  }

  @Get('/articles/:id')
  public async getArticle(@JoiParam(ObjectIdSchema) params: { id: string }) {
    return await this.articleService.getArticle(params.id);
  }

  @Delete('/articles/:id')
  @Roles('admin')
  public async deleteArticle(@JoiParam(ObjectIdSchema) params: { id: string }) {
    return await this.articleService.deleteArticle(params.id);
  }

  @Delete('/articles')
  @Roles('admin')
  public async deleteArticles(
    @JoiBody(generateObjectIdsSchema('articleIds'))
    body: {
      articleIds: string[];
    },
  ): Promise<any> {
    return await this.articleService.batchDelete(body.articleIds);
  }
}
