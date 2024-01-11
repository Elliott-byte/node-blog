import { Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login-info/:account')
  async getUserLoginInfo(@Param('account') account) {
    return this.userService.getUserByAccount(account);
  }

  @Put('update/:account')
  async updateUser(@Param('account') account: string) {
    return this.userService.updateUserByAccount(account, {
      type: 'admin',
      avatar: 'test',
      username: 'tom',
      email: 'test@email.com',
      account,
      password: 'test',
    });
  }

  @Put('reset-password/:account')
  async resetPassword(@Param('account') account: string) {
    return this.userService.resetPasswordByAccount(account, 'password');
  }
}
