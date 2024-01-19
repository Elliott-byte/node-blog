export * from './schemas/object-id-schema';
export * from './schemas/standard-pagination-schema';

import Joi from './joi';

/**
 * @description Joi schema for string type
 */
const JoiCharSchema = Joi.string().max(255);

export { JoiCharSchema };

export default Joi;
