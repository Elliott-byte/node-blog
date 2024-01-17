import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmpty } from 'lodash';
import Joi from '../joi';
import { Schema } from 'joi';

interface Options {
    method?: string;
}

@Injectable()
export class JoiValidationPipeTransform implements PipeTransform {
    constructor(
        private readonly schema: object,
        private readonly options: Options = {}
    ) {}
    public transform(data: any) {
        let joiObject: Schema = Joi.object(this.schema);
        if (!isEmpty(this.options.method)) {
            joiObject = joiObject.tailor(this.options.method);
        }

        const { error, value } = joiObject.validate(data, { allowUnknown: false });
        if (error) {
            throw new BadRequestException('Validation failed: ' + error);
        }
        return value;
    }
}
export const JoiValidation = (schema: object, options?: Options) => new JoiValidationPipeTransform(schema, options);
