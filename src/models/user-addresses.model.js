import BaseModel from "./base.model";

class UserAddressesModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "userAddresses";
    this._fields = UserAddressesModel.fields;
  }
}

UserAddressesModel.fields = {
  user: {
    // user.id
    type: "string",
    required: true,
  },
  fullName: {
    type: "string",
    required: true,
  },
  contactNo: {
    type: "string",
    required: true,
  },
  postalCode: {
    type: "string",
    required: true,
  },
  line1: {
    type: "string",
    required: true,
  },
  line2: {
    type: "string",
    required: false,
  },
  street: {
    type: "string",
    required: false,
  },
  city: {
    type: "string",
    required: true,
  },
  state: {
    type: "string",
    required: true,
  },
  isDefault: {
    type: "boolean",
    required: false,
  },
};

export default UserAddressesModel;
