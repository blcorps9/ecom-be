import BaseModel from "./base.model";
import { supportedCards } from "../config";

class CardsModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "cards";
    this._fields = CardsModel.fields;
  }
}

CardsModel.fields = {
  user: {
    type: "string", // user.id
    required: true,
  },
  holderName: {
    type: "string",
    required: true,
  },
  cardNumber: {
    type: "string",
    required: true,
    minlength: 9,
    maxlength: 16,
  },
  cvv: {
    type: "string",
    minlength: 3,
    maxlength: 4,
    required: true,
  },
  expiryMonth: {
    type: "string",
    required: true,
    minlength: 1,
    maxlength: 2,
  },
  expiryYear: {
    type: "string",
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  type: {
    type: "enum",
    enum: supportedCards,
    required: true,
  },
};

export default CardsModel;
