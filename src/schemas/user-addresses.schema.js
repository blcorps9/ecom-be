import Joi from "joi";

export const saveAddressSchema = Joi.object({
  // user: Joi.string().required(), // take user from current session
  fullName: Joi.string().required(),
  contactNo: Joi.string().pattern(new RegExp("^[789]\\d{9}$")).required(),
  postalCode: Joi.string().pattern(new RegExp("^\\d{6}$")).required(),
  line1: Joi.string().required(),
  line2: Joi.string().optional(),
  street: Joi.string().optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  isDefault: Joi.boolean().required(),
});

export const updateAddressSchema = Joi.object({
  // user: Joi.string().optional(),
  fullName: Joi.string().optional(),
  contactNo: Joi.string().pattern(new RegExp("^[789]\\d{9}$")).optional(),
  postalCode: Joi.string().pattern(new RegExp("^\\d{6}$")).optional(),
  line1: Joi.string().optional(),
  line2: Joi.string().optional(),
  street: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  isDefault: Joi.boolean().optional(),
});
