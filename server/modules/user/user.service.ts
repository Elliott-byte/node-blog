import { User, UserDocument } from '../../models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserByAccount(account: string) {
    return this.userModel.findOne({ account }, '-password');
  }

  async updateUserByAccount(account: string, user: object) {
    return this.userModel.updateOne({ account }, user);
  }

  async resetPasswordByAccount(account: string, password: string) {
    return this.userModel.updateOne({ account }, { password });
  }
}
