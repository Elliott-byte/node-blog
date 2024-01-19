import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminLogService } from '../adminlog/adminlog.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserJoiSchema } from '@blog/server/models/user.model';
import userDefaultData from '@blog/server/config/user.default.config';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { getDerivedKey } from '@blog/server/utils/crypto.util';
import { TOKEN_SECRET_KEY } from '@blog/server/config/index.config';
import { decrypt } from '@blog/server/utils/crypto.util';

@Injectable()
export class LoginService {
    constructor(
        private readonly adminLogService: AdminLogService,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    async getFirstLoginInfo() {
        const count = await this.userModel.countDocuments();
        if (count <= 0) {
            return {
                message: 'this is the first login, this account will be the admin account',
            };
        }
        return '';
    }

    async login(data) {
        const U = JSON.parse(decrypt(data.key));
        const userName = U.userName;
        const account = U.account;
        const password = U.password;
        const count = await this.userModel.countDocuments({});
        const result = Joi.object(UserJoiSchema).validate(U);
        if (count <= 0) {
            /**
             *  if the count is 0, it means that the user is the first login
             */
            if (result.error) {
                throw new BadRequestException('this is your first login' + result.error.message);
            }
            const user = await this.userModel.create({
                userName,
                account,
                avatar: userDefaultData.avatar,
                password: getDerivedKey(password),
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
        const user = await this.userModel.findOne({
            account,
            password: getDerivedKey(password),
        });
        if (user) {
            this.adminLogService.create({
                data: `user：${user.account} login`,
                type: 'system login',
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
        throw new BadRequestException('username or password error');
    }
}
