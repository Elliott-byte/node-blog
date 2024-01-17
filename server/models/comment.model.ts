import Joi from '../joi';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Article } from './article.model';
import paginate from '../mongoose/paginate';
import { getMongooseModule } from '../mongoose';

export const CommentJoiSchema = {
    nickName: Joi.string()
        .min(1)
        .max(80)
        .alter({ post: (schema) => schema.required() }),
    email: Joi.string()
        .email()
        .alter({ post: (schema) => schema.required() }),
    content: Joi.string()
        .min(1)
        .max(500)
        .alter({ post: (schema) => schema.required() }),
    parentId: [Joi.equal(null), Joi.objectId()],
    reply: [Joi.equal(null), Joi.objectId()],
    article: Joi.objectId().alter({
        post: (schema) => schema.required(),
    }),
    identity: Joi.number().min(0).max(4),
    website: Joi.string().allow(''),
};

export type CommentDocument = Comment & Document;

@Schema({
    timestamps: true,
    collection: Comment.name.toLocaleLowerCase(),
})
export class Comment {
    @Prop({ maxlength: 80, trim: true, required: true })
    nickName: string;

    @Prop({ maxlength: 80, trim: true, required: true })
    email: string;

    @Prop({ maxlength: 80, trim: true, default: '' })
    website: string;

    @Prop({ maxlength: 500, trim: true, required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Comment.name, default: null })
    parentId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Comment.name, default: null })
    reply: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Article.name, equired: true })
    article: string;

    @Prop({ maxlength: 80, trim: true, default: '' })
    location: string;

    @Prop({ default: true })
    pass: boolean;

    // admin is 1，visitor is 0
    @Prop({ max: 4, default: 0 })
    identity: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.plugin(paginate);

export const CommentModelModule = getMongooseModule(Comment.name, CommentSchema);
