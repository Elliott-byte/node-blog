import { Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { RolesGuard } from '@blog/server/guards/roles.guard';
import { CommentJoiSchema } from '@blog/server/models/comment.model';
import { JoiBody, JoiParam, JoiQuery } from '@blog/server/decorators/joi.decorator';
import { omit } from 'lodash';
import { Comment } from '@blog/server/models/comment.model';
import { Roles } from '@blog/server/decorators/roles.decorator';
import {
    ObjectIdSchema,
    StandardPaginationSchema,
    generateObjectIdSchema,
    generateObjectIdsSchema,
} from '@blog/server/joi';
import { auth } from '@blog/server/utils/auth.util';

@Controller('/api')
@UseGuards(RolesGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('/comments')
    async create(@Req() req: Request, @JoiBody(CommentJoiSchema, { method: 'post' }) comment: Comment) {
        console.log('newComment', comment);
        const data = await this.commentService.create(comment);
        return omit(data.toJSON(), 'email');
    }

    @Post('/admin/reply-comment')
    @Roles('admin')
    async adminReplyComment(
        @JoiBody(
            {
                article: CommentJoiSchema.article,
                parentId: CommentJoiSchema.parentId[1].required(),
                content: CommentJoiSchema.content,
            },
            { method: 'post' }
        )
        comment: Comment
    ) {
        const data = await this.commentService.create(comment, true);
        return data;
    }

    @Put('/comments/:id')
    @Roles('admin')
    async update(@JoiParam(ObjectIdSchema) params: { id: string }, @JoiBody(CommentJoiSchema) comment: Comment) {
        return await this.commentService.update(params.id, comment);
    }

    @Get('/admin-comments')
    @Roles('admin')
    async getAdminComments(
        @Req() req: Request,
        @JoiQuery({ ...StandardPaginationSchema, ...generateObjectIdSchema('articleId') })
        query: {
            page: number;
            limit: number;
            articleId: string;
        }
    ) {
        let field = '';
        if (!auth(req)) {
            field = '-email';
        }
        const { items, totalCount } = await this.commentService.getAdminCommentList({
            ...query,
            field,
        });
        return {
            items,
            totalCount,
        };
    }

    @Get('/comments')
    async getComments(
        @Req() req: Request,
        @JoiQuery({ ...StandardPaginationSchema, ...generateObjectIdSchema('articleId') })
        query: {
            page: number;
            limit: number;
            articleId: string;
        }
    ) {
        let field = '';
        if (!auth(req)) {
            field = '-email';
        }
        const { items, totalCount } = await this.commentService.getCommentList({
            ...query,
            field,
        });
        return {
            items,
            totalCount,
        };
    }

    @Get('/comments/:id')
    @Roles('admin')
    async getComment(@JoiParam(ObjectIdSchema) params: { id: string }): Promise<Comment | null> {
        return await this.commentService.getComment(params.id);
    }

    @Delete('/comments/:id')
    @Roles('admin')
    async deleteComment(@JoiParam(ObjectIdSchema) params: { id: string }) {
        return await this.commentService.deleteComment(params.id);
    }

    @Get('/recent-comments')
    @Roles('admin')
    async recentComments() {
        return await this.commentService.recentComments();
    }

    @Delete('/comments')
    @Roles('admin')
    deleteComments(@JoiBody(generateObjectIdsSchema('commentIds')) body: { commentIds: string[] }): Promise<any> {
        return this.commentService.batchDelete(body.commentIds);
    }
}
