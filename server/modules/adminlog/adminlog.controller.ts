import { Controller, Get } from '@nestjs/common';
import { AdminLogService } from './adminlog.service';
import { JoiQuery } from '@blog/server/decorators/joi.decorator';
import { StandardPaginationSchema } from '@blog/server/joi/schemas/standard-pagination-schema';
import { Roles } from '@blog/server/decorators/roles.decorator';
@Controller()
export class AdminLogController {
    constructor(private readonly adminLogService: AdminLogService) {}

    @Get('/api/admin-logs')
    @Roles('admin')
    async getAdminLogs(@JoiQuery(StandardPaginationSchema) query: { page: number; limit: number }) {
        return await this.adminLogService.getAdminLogs(query);
    }

    @Get('/api/recent-admin-logs')
    @Roles('admin')
    async getRecentAdminLogs() {
        return await this.adminLogService.getRecentAdminLogs();
    }
}
