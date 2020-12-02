import BaseModel from "./base.model";

class StripeModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "stripe";
    this._fields = StripeModel.fields;
  }
}

StripeModel.fields = {
  user: {
    type: "string", // email
    required: true,
  },
  customerId: {
    type: "string", // Stripe customer.id
    required: true,
  },
};

export default StripeModel;
