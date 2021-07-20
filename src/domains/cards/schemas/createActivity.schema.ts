import * as Joi from 'joi';

export const CreateActivitySchema = Joi.object({
  userId: Joi.number().required(),
  message: Joi.string().required(),
  date: Joi.date().required()
});