import BaseModel from "./base.model";

class OrdersModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "orders";
    this._fields = OrdersModel.fields;
  }
}

OrdersModel.fields = {
  user: {
    // user.id
    type: "string",
    required: true,
  },
  card: {
    // card.id
    type: "string",
    required: true,
  },
  address: {
    // address.id
    type: "string",
    required: true,
  },
  deliveryDate: {
    type: "string",
    required: true,
  },
  total: {
    type: "number",
    required: true,
  },
  tax: {
    type: "number", // in %
    required: true,
  },
  discount: {
    type: "number", // in %
    required: true,
  },
  items: {
    type: "object", // [{ id, quantity, price, color, size }]
    required: true,
  },
};

export default OrdersModel;
