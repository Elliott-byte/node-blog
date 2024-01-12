import { CategoryModelModule } from '@blog/server/models/category.model';
import { Module } from '@nestjs/common';

@Module({
  imports: [CategoryModelModule],
  controllers: [],
  providers: [],
})
export class CategoryModule {}
