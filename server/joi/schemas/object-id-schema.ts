import { isEmpty } from 'lodash';
import Joi from '../joi';

export const ObjectIdSchema = {
  id: Joi.objectId(),
};

export const generateObjectIdSchema = (field: string) => {
  if (isEmpty(field)) {
    throw new Error('generate object id schema, field is required');
  }
  return {
    [field]: Joi.objectId(),
  };
};

export const generateObjectIdsSchema = (field: string) => {
  if (isEmpty(field)) {
    throw new Error('generate object ids schema, field is required');
  }
  return {
    [field]: Joi.array().items(Joi.objectId().required()),
  };
};
