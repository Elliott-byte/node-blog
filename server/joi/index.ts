import Joi from 'joi';

const JoiCharSchema = Joi.string().max(255);

export { JoiCharSchema };

export default Joi;
