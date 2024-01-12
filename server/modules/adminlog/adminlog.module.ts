import { AdminLogModelModule } from '@blog/server/models/adminlog.model';
import { Module } from '@nestjs/common';
import { AdminLogController } from './adminlog.controller';
import { AdminLogService } from './adminlog.service';

@Module({
  imports: [AdminLogModelModule],
  controllers: [AdminLogController],
  providers: [AdminLogService],
  exports: [AdminLogService],
})
export class AdminLogModule {}
