import * as Joi from 'joi';

export const CreateCardSchema = Joi.object({
  userId: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  date: {
    from: Joi.date().less(Joi.ref('date.to')),
    to: Joi.date().greater(Joi.ref('date.from'))
  }
});