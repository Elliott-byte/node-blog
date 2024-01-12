import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminLogService } from '../adminlog/adminlog.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '@blog/server/models/user.model';
import userDefaultData from '@blog/server/config/user.default.config';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { getDerivedKey } from '@blog/server/utils/crypto.util';
import { TOKEN_SECRET_KEY } from '@blog/server/config/index.config';

@Injectable()
export class LoginService {
  constructor(
    private readonly adminLogService: AdminLogService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getFirstLoginInfo() {
    const count = await this.userModel.countDocuments();
    if (count <= 0) {
      return {
        message:
          'this is the first login, this account will be the admin account',
      };
    }
    return '';
  }

  async login(data) {
    //todo decrypt data to user
    // const U = JSON.parse(decrpt(data));
    const U = JSON.parse(data);
    const userName = U.userName;
    const account = U.account;
    const password = U.password;
    const count = await this.userModel.countDocuments({});
    const result = Joi.object(UserSchema).validate(U);
    if (count <= 0) {
      if (result.error) {
        throw new BadRequestException(
          'This is the first time login, please remember your account and password',
        );
      }
      const user = await this.userModel.create({
        userName,
        account,
        avatar: userDefaultData.avatar,
        password: getDerivedKey(password),
      });
      if (user) {
        this.adminLogService.create({
          data: `user ${user.userName} login`,
          type: 'login',
          user: user._id,
        });
        return {
          userName: user.userName,
          account,
          avatar: user.avatar,
          email: user.email,
          token: jwt.sign({ account, roles: ['admin'] }, TOKEN_SECRET_KEY, {
            expiresIn: '7d',
          }),
        };
      }
    }
    const user = await this.userModel.findOne({
      account,
      password: getDerivedKey(password),
    });
    if (user) {
      this.adminLogService.create({
        data: `user ${user.userName} login`,
        type: 'login',
        user: user._id,
      });
      return {
        userName: user.userName,
        avatar: user.avatar,
        email: user.email,
        account,
        token: jwt.sign({ account, roles: ['admin'] }, TOKEN_SECRET_KEY, {
          expiresIn: '7d',
        }),
      };
    }
    throw new BadRequestException('account or password error');
  }
}
