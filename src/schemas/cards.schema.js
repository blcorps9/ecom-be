import Joi from "joi";

import { supportedCards } from "../config";
import { isValidCardNumber } from "../utils";

function cardNumValidation(num, helpers) {
  if (isValidCardNumber(num)) {
    return num;
  }

  return helpers.message("Invalid credit card number.");
}

export const saveCardSchema = Joi.object({
  holderName: Joi.string().required(),
  cardNumber: Joi.string().custom(cardNumValidation),
  cvv: Joi.string().min(3).max(4).required(),
  expiryMonth: Joi.string().min(1).max(2).required(),
  expiryYear: Joi.string().min(4).max(4).required(),
  type: Joi.string()
    .valid(...supportedCards)
    .required(),
});

export const updateCardSchema = Joi.object({
  holderName: Joi.string().optional(),
  cardNumber: Joi.string().custom(cardNumValidation),
  cvv: Joi.string().min(3).max(4).optional(),
  expiryMonth: Joi.string().min(1).max(2).optional(),
  expiryYear: Joi.string().min(4).max(4).optional(),
  type: Joi.string()
    .valid(...supportedCards)
    .optional(),
});
