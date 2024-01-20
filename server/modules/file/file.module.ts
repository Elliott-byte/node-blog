import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileModelModule } from '@blog/server/models/file.model';
import { DynamicConfigModule } from '../dynamic-config/dynamic.module';

@Module({
    controllers: [FileController],
    providers: [FileService],
    imports: [FileModelModule, DynamicConfigModule],
})
export class FileModule {}
