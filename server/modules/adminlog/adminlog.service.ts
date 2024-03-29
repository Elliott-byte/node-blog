import { AdminLog, AdminLogDocument } from '@blog/server/models/adminlog.model';
import { IPaginate } from '@blog/server/mongoose/paginate';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminLogService {
  constructor(
    @InjectModel(AdminLog.name)
    private readonly adminLogModel: Model<AdminLogDocument> & IPaginate,
  ) {}

  async getAdminLogs(options: {
    page?: number;
    limit?: number;
    sort?: object;
  }): Promise<{ items: AdminLog[]; totalCount: number }> {
    const { page = 1, limit = 100, sort = { createdAt: -1 } } = options;
    return await this.adminLogModel.paginate({}, '', { page, limit, sort });
  }

  async create(adminLog: AdminLog): Promise<AdminLog> {
    return await this.adminLogModel.create(adminLog);
  }

  async getRecentAdminLogs() {
    return this.adminLogModel.find({}, '', {
      limit: 10,
      sort: { createdAt: -1 },
    });
  }
}
