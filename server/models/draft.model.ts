import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Joi from '../joi';
import mongoose from 'mongoose';
import paginate from '../mongoose/paginate';
import { getMongooseModule } from '../mongoose';

export const DraftJoiSchema = {
    data: Joi.object(),
    type: Joi.string(),
};

export type DraftDocument = Draft & Document;

export enum DRAFT_TYPE {
    ARTICLE = 'article',
}

@Schema({
    timestamps: true,
    collection: Draft.name.toLocaleLowerCase(),
})
export class Draft {
    _id: string;

    createdAt: string | Date;

    @Prop({ type: mongoose.SchemaTypes.Mixed })
    data: mongoose.Mixed;

    @Prop({ default: DRAFT_TYPE.ARTICLE, enum: [DRAFT_TYPE.ARTICLE] })
    type: string;
}

export const DraftSchema = SchemaFactory.createForClass(Draft);

DraftSchema.plugin(paginate);

export const DraftModelModule = getMongooseModule(Draft.name, DraftSchema);
