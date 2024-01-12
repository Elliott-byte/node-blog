import { Draft, DraftDocument } from '@blog/server/models/draft.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginate } from '../../mongoose/paginate/index';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { isEmpty } from 'lodash';

@Injectable()
export class DraftService {
  constructor(
    @InjectModel(Draft.name)
    private readonly draftModel: Model<DraftDocument> & IPaginate,
  ) {}

  async create(document: Draft) {
    return await this.draftModel.create(document);
  }

  async update(_id: string, data: Draft) {
    const draft = await this.draftModel.findOneAndUpdate({ _id }, data, {
      runValidators: true,
    });
    if (isEmpty(draft)) {
      return await this.create({ _id, ...data });
    }
    return draft;
  }

  async getDraft(id: string) {
    const draft = await this.draftModel.findById(id);
    if (isEmpty(draft)) {
      throw new NotFoundException('Draft not found');
    }
    return draft;
  }
}
