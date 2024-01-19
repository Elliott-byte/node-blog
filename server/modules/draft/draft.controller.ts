import { RolesGuard } from '@blog/server/guards/roles.guard';
import { Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { DraftService } from './draft.service';
import { Roles } from '@blog/server/decorators/roles.decorator';
import { JoiBody, JoiParam, JoiQuery } from '@blog/server/decorators/joi.decorator';
import { Draft, DraftJoiSchema } from '@blog/server/models/draft.model';
import { ObjectIdSchema } from '@blog/server/joi/schemas/object-id-schema';
import Joi, { StandardPaginationSchema } from '@blog/server/joi';

@Controller('/api')
@UseGuards(RolesGuard)
export class DraftController {
    public constructor(private readonly draftService: DraftService) {}

    @Post('/drafts')
    @Roles('admin')
    public async create(@JoiBody(DraftJoiSchema, { method: 'post' }) draft: Draft) {
        return await this.draftService.create(draft);
    }

    @Put('/drafts/:id')
    @Roles('admin')
    public async update(@JoiParam(ObjectIdSchema) params: { id: string }, @JoiBody(DraftJoiSchema) draft: Draft) {
        console.log(params);
        console.log(draft);
        return await this.draftService.update(params.id, draft);
    }

    @Get('/drafts')
    @Roles('admin')
    public async getDrafts(
        @JoiQuery({ type: Joi.string(), ...StandardPaginationSchema })
        query: {
            page: number;
            limit: number;
            type: string;
        }
    ) {
        return this.draftService.getList(query);
    }

    @Get('/drafts/:id')
    public async getDraft(@JoiParam(ObjectIdSchema) params: { id: string }) {
        return await this.draftService.getDraft(params.id);
    }
}
