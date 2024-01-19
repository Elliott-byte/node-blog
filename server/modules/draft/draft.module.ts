import { DraftModelModule } from '@blog/server/models/draft.model';
import { Module } from '@nestjs/common';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';

@Module({
    imports: [DraftModelModule],
    controllers: [DraftController],
    providers: [DraftService],
})
export class DraftModule {}
