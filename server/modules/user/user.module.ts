import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModelModule } from '@blog/server/models/user.model';

@Module({
    imports: [UserModelModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
