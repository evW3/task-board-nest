import * as Joi from 'joi';

export const WorkplaceSchema = Joi.object({
  userId: Joi.number().required(),
  name: Joi.string().required()
});