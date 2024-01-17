import { Category, CategoryDocument } from '@blog/server/models/category.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>
    ) {}

    async create(newCategory: Category): Promise<Category> {
        return await this.categoryModel.create(newCategory);
    }

    async update(id: string, data: Category): Promise<Category | null> {
        await this.categoryModel.updateOne({ _id: id }, data, {});
        return await this.categoryModel.findById(id);
    }

    async getCategories(options: { page?: number; limit?: number }): Promise<Category[]> {
        const { page = 1, limit = 100 } = options;
        return this.categoryModel.find({}, '', {
            skip: (page - 1) * limit,
            limit,
            sort: { order: 1 },
        });
    }

    async getCategory(id: string) {
        return await this.categoryModel.findById(id);
    }

    async deleteCategory(id: string) {
        const category = await this.categoryModel.findById(id);
        await this.categoryModel.deleteOne({ _id: id });
        return category;
    }

    async batchDelete(categoryIds: string[]) {
        return this.categoryModel.find({ _id: { $in: categoryIds } }).then((categories) => {
            if (categories.length <= 0) {
                throw new BadRequestException();
            }
            return this.categoryModel.deleteMany({ _id: { $in: categoryIds } });
        });
    }
}
