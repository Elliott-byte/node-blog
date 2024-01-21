import { CategoryModelModule } from '@blog/server/models/category.model';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    imports: [CategoryModelModule],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
