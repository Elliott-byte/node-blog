import { Document } from 'mongoose';

export type UserDocument = User & Document;

import Joi from 'joi';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import paginate from '../mongoose/paginate';
import { sha1 } from '../utils/crypto.util';
import { getMongooseModule } from '../mongoose';

export const UserJoiSchema = {
  userName: Joi.string()
    .min(1)
    .max(30)
    .required()
    .error(new Error('username should be between 1 and 30 characters')),
  account: Joi.string()
    .min(6)
    .max(30)
    .required()
    .error(new Error('account should be between 6 and 30 characters')),
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .error(new Error('password should be between 6 and 30 characters')),
};

@Schema({
  timestamps: true,
  collection: User.name.toLocaleLowerCase(),
})
export class User {
  @Prop({
    enum: ['admin'],
    default: 'admin',
    required: true,
  })
  type: string;

  @Prop({
    maxlength: 255,
    trim: true,
  })
  avatar: string;

  @Prop({
    minLength: 1,
    maxlength: 100,
    trim: true,
  })
  userName: string;

  @Prop({
    maxlength: 100,
    trim: true,
  })
  email: string;

  @Prop({
    unique: true,
    minlength: 6,
    maxlength: 30,
    trim: true,
    lowercase: true,
    required: true,
  })
  account: string;

  @Prop({
    minlength: 6,
    maxlength: 30,
    trim: true,
    required: true,
    set: sha1,
    select: false,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  createAt: -1,
});

UserSchema.plugin(paginate);

export const UserModelModule = getMongooseModule(User.name, UserSchema);
