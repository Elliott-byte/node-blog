import { AdminLogModelModule } from '@blog/server/models/adminlog.model';
import { UserModelModule } from '@blog/server/models/user.model';
import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AdminLogService } from '../adminlog/adminlog.service';

@Module({
    imports: [UserModelModule, AdminLogModelModule],
    controllers: [LoginController],
    providers: [LoginService, AdminLogService],
})
export class LoginModule {}
