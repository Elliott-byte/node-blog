import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '@blog/server/decorators/roles.decorator';
import {
  JoiBody,
  JoiParam,
  JoiQuery,
} from '@blog/server/decorators/joi.decorator';
import {
  Category,
  CategoryJoiSchema,
} from '@blog/server/models/category.model';
import {
  ObjectIdSchema,
  generateObjectIdSchema,
} from '@blog/server/joi/schemas/object-id-schema';
import { StandardPaginationSchema } from '@blog/server/joi/schemas/standard-pagination-schema';
import { RolesGuard } from '@blog/server/guards/roles.guard';

@Controller('/api')
@UseGuards(RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/categories')
  @Roles('admin')
  async create(
    @JoiBody(CategoryJoiSchema, { method: 'post' }) category: Category,
  ) {
    return await this.categoryService.create(category);
  }

  @Put('/categories/:id')
  @Roles('admin')
  async update(
    @JoiParam(ObjectIdSchema) params: { id: string },
    @JoiBody(CategoryJoiSchema) category: Category,
  ) {
    return await this.categoryService.update(params.id, category);
  }

  @Get('/categories')
  async getCategoris(
    @JoiQuery(StandardPaginationSchema) query: { page: number; limit: number },
  ): Promise<Category[]> {
    return await this.categoryService.getCategories({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('/categories/:id')
  @Roles('admin')
  async deleteCategory(@JoiParam(ObjectIdSchema) params: { id: string }) {
    return await this.categoryService.deleteCategory(params.id);
  }

  @Delete('/categories')
  @Roles('admin')
  deleteArticles(
    @JoiBody(generateObjectIdSchema('categoryIds'))
    body: {
      categoryIds: string[];
    },
  ): Promise<any> {
    return this.categoryService.batchDelete(body.categoryIds);
  }
}
