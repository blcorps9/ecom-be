import bcrypt from "bcrypt";
import { sign as jwtSign } from "jsonwebtoken";

import BaseModel from "./base.model";

import {
  jwtSecret,
  jwtAlgorithm,
  jwtExpirationInterval,
  bcryptSaltRounds,
} from "../config";

const ROLES = ["user", "admin"];

class UserModel extends BaseModel {
  constructor(db) {
    super(db);

    this._tableName = "users";
    this._fields = UserModel.fields;
  }

  async create(row) {
    if (this.validatePassword(row.password)) {
      const hash = await this.genPasswordHash(row.password);

      row.password = hash;

      BaseModel.prototype.create.call(this, row);
    }
  }

  async update(userId, newRow) {
    const { id, password, createdAt, ...rest } = newRow;

    BaseModel.prototype.update.call(this, userId, rest);
  }

  async checkUser(password, hash) {
    const match = await bcrypt.compare(password, hash);

    return match;
  }

  async login(username, password) {
    const user = await this.findOne({ email: username }, null, true);

    if (user) {
      const isUser = await this.checkUser(password, user.password);

      if (isUser) {
        return this.genToken(username);
      } else {
        throw new Error("Username and password doen not match.");
      }
    } else {
      throw new Error("Username and password doen not match.");
    }
  }

  genPasswordHash(pass) {
    return bcrypt.hash(pass, bcryptSaltRounds);
  }

  genToken(user) {
    const epoch = Date.now();
    const playload = {
      iat: epoch,
      sub: user,
    };

    return jwtSign(playload, jwtSecret, {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpirationInterval,
    });
  }

  validatePassword(pass) {
    if (typeof pass === "string") {
      if (pass.length < 6 || pass.length > 128) {
        return false;
      }

      return true;
    }

    return false;
  }
}

UserModel.fields = {
  email: {
    type: "string",
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    novalidation: true,
    type: "string",
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: "string",
    maxlength: 128,
    index: true,
    trim: true,
  },
  role: {
    type: "enum",
    enum: ROLES,
    default: "user",
  },
  avatar: {
    type: "string",
    trim: true,
  },
};

export default UserModel;
