import BaseModel from "./base.model";

class CartsModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "carts";
    this._fields = CartsModel.fields;
  }

  findAllByCategory(cat) {
    return this.findAll({ category: cat });
  }
}

CartsModel.fields = {
  user: {
    type: "string", // user.id
    required: true,
  },
  items: {
    type: "object", // [{ id, quantity, price, color, size }]
    required: true,
  },
};

export default CartsModel;
