import { LoginService } from './login.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller()
export class LoginController {
  constructor(private readonly LoginService: LoginService) {}

  @Get('/api/getFirstLoginInfo')
  async getFirstLoginInfo() {
    return await this.LoginService.getFirstLoginInfo();
  }

  @Post('/api/login')
  async login(@Body() body) {
    return await this.LoginService.login(body);
  }
}
