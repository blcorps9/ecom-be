import Joi from "joi";

export const saveItemToFavListSchema = Joi.object({
  // user: Joi.string().required(), // take user from current session
  id: Joi.string().required(),
  color: Joi.string().optional(),
  size: Joi.string().optional(),
});
