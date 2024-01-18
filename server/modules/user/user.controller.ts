import { BadRequestException, Body, Controller, ForbiddenException, Get, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '@blog/server/decorators/roles.decorator';
import { auth } from '@blog/server/utils/auth.util';
import { JoiBody } from '@blog/server/decorators/joi.decorator';
import Joi from 'joi';
import { decrypt, getDerivedKey } from '@blog/server/utils/crypto.util';
import { Request } from 'express';

@Controller('/api/user/')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('login-info/:account')
    @Roles('admin')
    async getUserLoginInfo(@Req() req: Request) {
        const user: any = auth(req);
        if (user) {
            return await this.userService.getUserByAccount(user.account);
        }
        throw new ForbiddenException('illegal request');
    }

    @Put('update')
    async updateUser(
        @Req() req: Request,
        @JoiBody({
            avatar: Joi.string(),
            userName: Joi.string(),
            email: Joi.string().email(),
        })
        body
    ) {
        const user: any = auth(req);
        if (user) {
            return await this.userService.updateUserByAccount(user.account, body);
        }
        throw new ForbiddenException('illegal request');
    }

    @Put('reset-password')
    async resetPassword(@Req() req: Request, @Body() body) {
        const user: any = auth(req);
        if (user) {
            const { error } = Joi.string().min(1).max(250).validate(body.key);
            if (error) {
                throw new BadRequestException('illegal content, the length must be between 1 and 250');
            }
            const jsonStr = decrypt(body.key);
            let data: { password: string } = null;
            try {
                data = JSON.parse(jsonStr);
            } catch (err) {
                throw new BadRequestException('illegal content, the content should be json');
            }
            const password = getDerivedKey(data.password);
            return await this.userService.resetPasswordByAccount(user.account, password);
        }

        throw new ForbiddenException('illegal request');
    }
}
