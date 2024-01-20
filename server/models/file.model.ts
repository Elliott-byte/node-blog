import Joi from '../joi';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import paginate from '../mongoose/paginate';
import { getMongooseModule } from '../mongoose';

export enum FileType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    Document = 'document',
    Other = 'other',
}

export const FileJoiSchema = {
    name: Joi.string(),
    type: Joi.string(),
    size: Joi.number(),
    url: Joi.string().max(2000),
};

export type FileDocument = File & Document;

@Schema({
    timestamps: true,
    collection: File.name.toLocaleLowerCase(),
})
export class File {
    @Prop({
        trim: true,
        required: true,
    })
    name: string;

    @Prop({
        maxlength: 80,
        trim: true,
        required: true,
    })
    originName: string;

    @Prop({
        enum: ['image', 'video', 'audio', 'document', 'other'],
        trim: true,
        required: true,
    })
    type: string;

    @Prop({
        type: Number,
        required: true,
    })
    size: number;

    @Prop({
        trim: true,
        required: true,
    })
    url: string;
}

export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.plugin(paginate);

export const FileModelModule = getMongooseModule(File.name, FileSchema);
