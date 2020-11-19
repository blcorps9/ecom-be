import Joi from "joi";

export const addToCartItemSchema = Joi.object({
  // user: Joi.string().required(), // take user from current session
  id: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  color: Joi.string().optional(),
  size: Joi.string().optional(),
});

export const updateCartItemSchema = Joi.object({
  // user: Joi.string().required(), // take user from current session
  // id: Joi.string().required(), // should be available in the path/params
  quantity: Joi.number().optional(),
  color: Joi.string().optional(),
  size: Joi.string().optional(),
});
