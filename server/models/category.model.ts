import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Joi from '../joi';
import paginate from '../mongoose/paginate';
import { getMongooseModule } from '../mongoose';

export const CategoryJoiSchema = {
  name: Joi.string()
    .min(1)
    .max(80)
    .alter({
      post: (schema) => schema.required(),
    }),
};

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
  collection: Category.name.toLowerCase(),
})
export class Category {
  @Prop({ maxLength: 80, trim: true, required: true })
  name: string;

  @Prop({
    max: 200,
    default: 0,
  })
  order: number;

  @Prop({ default: 0 })
  articleCount: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.plugin(paginate);

export const CategoryModelModule = getMongooseModule(
  Category.name,
  CategorySchema,
);
