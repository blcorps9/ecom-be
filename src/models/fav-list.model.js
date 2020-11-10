import BaseModel from "./base.model";

class FavListModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "favList";
    this._fields = FavListModel.fields;
  }
}

FavListModel.fields = {
  user: {
    type: "string",
    required: true,
    unique: true,
  },
  items: {
    type: "object", // [{ id, color, size }]
    required: true,
  },
};

export default FavListModel;
