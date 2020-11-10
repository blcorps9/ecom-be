import BaseModel from "./base.model";

class ProductsModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "products";
    this._fields = ProductsModel.fields;
  }

  findAllByCategory(cat) {
    return this.findAll({ category: cat });
  }
}

ProductsModel.fields = {
  id: {
    type: "number",
    required: true,
  },
  image: {
    type: "string",
    required: true,
  },
  brand: {
    type: "string",
    required: true,
  },
  name: {
    type: "string",
    required: true,
  },
  sizes: {
    type: "object",
  },
  colors: {
    type: "object",
  },
  price: {
    type: "number",
    required: true,
  },
  stock: {
    type: "number",
    required: true,
  },
  ratings: {
    type: "number",
    required: true,
  },
  reviews: {
    type: "number",
    required: true,
  },
  category: {
    type: "string",
    required: true,
  },
  categoryPage: {
    type: "string",
    required: true,
  },
  detailsPage: {
    type: "string",
    required: true,
  },
};

export default ProductsModel;
