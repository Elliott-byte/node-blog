import { Roles } from '@blog/server/decorators/roles.decorator';
import { Controller, Delete, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ObjectIdSchema, StandardPaginationSchema, generateObjectIdSchema } from '@blog/server/joi';
import { RolesGuard } from '@blog/server/guards/roles.guard';
import { JoiBody, JoiParam, JoiQuery } from '@blog/server/decorators/joi.decorator';

@Controller('/api')
@UseGuards(RolesGuard)
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Get('/files')
    @Roles('admin')
    async getFiles(
        @JoiQuery({ ...StandardPaginationSchema, ...generateObjectIdSchema('parentId') })
        query: {
            page: number;
            limit: number;
            parentId: string;
        }
    ) {
        const { items, totalCount } = await this.fileService.getFileList(query);
        return {
            items,
            totalCount,
        };
    }

    @Post('/files/upload')
    @Roles('admin')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: any) {
        return await this.fileService.uploadFile(file);
    }

    @Delete('/files/:id')
    @Roles('admin')
    async deleteFile(@JoiParam(ObjectIdSchema) params: { id: string }) {
        return await this.fileService.deleteFile(params.id);
    }

    @Delete('/files')
    @Roles('admin')
    deleteArticles(@JoiBody(generateObjectIdSchema('fileIds')) body: { fileIds: string[] }): Promise<any> {
        return this.fileService.batchDelete(body.fileIds);
    }
}
