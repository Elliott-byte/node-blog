import { Body, Param, Query } from '@nestjs/common';
import { JoiValidation } from '../pipes/joi.validation.pipe';

export const JoiParam = (schema: object) => Param(JoiValidation(schema));
export const JoiQuery = (schema: object) => Query(JoiValidation(schema));
export const JoiBody = (schema: object) => Body(JoiValidation(schema));
