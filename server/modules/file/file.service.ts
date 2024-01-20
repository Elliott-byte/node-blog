import { FileDocument, FileType, File } from '@blog/server/models/file.model';
import { IPaginate } from '@blog/server/mongoose/paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { DynamicConfigService } from '../dynamic-config/dynamic.config.service';
import { Model } from 'mongoose';
import { md5 } from '@blog/server/utils/crypto.util';
import path from 'path';
import { createUploadFile } from '@blog/server/utils/upload.utils';

MulterModule.register({
    storage: multer.memoryStorage(),
});

@Injectable()
export class FileService {
    FILE_TYPE_MAP_MIMETYPE = [
        {
            type: FileType.Video,
            mimetypes: ['mp4', 'x-flv'],
        },
        {
            type: FileType.Audio,
            mimetypes: ['mpeg', 'mp3'],
        },
        {
            type: FileType.Image,
            mimetypes: ['png', 'jpg', 'jpeg', 'webp'],
        },
        {
            type: FileType.Document,
            mimetypes: ['txt', 'doc', 'docx', 'pdf'],
        },
        {
            type: FileType.Other,
            mimetypes: [],
        },
    ];
    constructor(
        @InjectModel(File.name) private readonly fileModel: Model<FileDocument> & IPaginate,
        private readonly configService: DynamicConfigService
    ) {}

    async getFileList(options: {
        page?: number;
        limit?: number;
        sort?: any;
    }): Promise<{ items: File[]; totalCount: number }> {
        const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
        return await this.fileModel.paginate({}, '', { page, limit, sort });
    }

    async deleteFile(id: string) {
        const _file = await this.fileModel.findById(id);
        if (_file) {
            await this.fileModel.deleteOne({ _id: id });
        }
        return {};
    }

    public async batchDelete(fileIds: string[]) {
        return this.fileModel.deleteMany({ _id: { $in: fileIds } });
    }

    public async uploadFile(file: Express.Multer.File) {
        const mimetype = file.mimetype;
        const size = file.size;
        const name = md5(file.buffer);

        const suffix = path.extname(file.originalname);
        const fileName = name + suffix;
        const buf = file.buffer;
        let type = FileType.Other;
        for (const item of this.FILE_TYPE_MAP_MIMETYPE) {
            const rs = item.mimetypes.some((t) => {
                return mimetype.toLocaleLowerCase().includes(t);
            });
            if (rs) {
                if (item.type === FileType.Image) {
                    if (Number(size) > 1024 * 1024 * 2) {
                        throw new BadRequestException('image size must be less than 2M');
                    }
                }
                type = item.type;
                break;
            }
        }
        const domain = this.configService.siteDomain;
        const p = await createUploadFile(fileName, buf);
        console.log(p);
        const url = domain + p;
        console.log(url);
        const result = await this.fileModel.findOneAndUpdate({ name: fileName }, { url });
        if (result) {
            return { ...result.toObject(), url };
        }
        const _file = await this.fileModel.create({
            name: fileName,
            originName: file.originalname,
            type,
            size,
            url,
        });
        return _file;
    }
}
