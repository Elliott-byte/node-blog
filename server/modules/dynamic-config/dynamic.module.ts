import { Module } from '@nestjs/common';
import { DynamicConfigController } from './dynamic.config.controller';
import { DynamicConfigService } from './dynamic.config.service';
import { DynamicConfigModelModule } from '@blog/server/models/dynamic.config.model';

@Module({
    imports: [DynamicConfigModelModule],
    controllers: [DynamicConfigController],
    providers: [DynamicConfigService],
    exports: [DynamicConfigService],
})
export class DynamicConfigModule {}
