import Joi from "joi";

export const saveOrderSchema = Joi.object({
  // user: Joi.string().required(), // take user from current session
  card: Joi.string().required(), // card.id
  address: Joi.string().required(), // address.id
  deliveryDate: Joi.string().required(), // new Date()
  total: Joi.number().required(),
  tax: Joi.number().required(),
  discount: Joi.number().required(),
  items: Joi.array()
    .items(
      Joi.object()
        .keys({
          id: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
          color: Joi.string().optional(),
          size: Joi.string().optional(),
        })
        .required()
    )
    .required(),
});
