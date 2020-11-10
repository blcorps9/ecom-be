import Joi from "joi";

import { userRoles } from "../config";

export const registerSchema = Joi.object({
  avatar: Joi.string().optional(),
  name: Joi.string().max(128).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string()
    .valid(...userRoles)
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
});
