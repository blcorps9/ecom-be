import Joi from "joi";

export const saveOrderSchema = Joi.object({
  // user: Joi.string().required(), // take user from current session
  card: Joi.string().required(), // card.id
  cart: Joi.string().required(), // cart.id
  address: Joi.string().required(), // address.id
});
