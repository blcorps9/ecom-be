import _has from "lodash/has";
import _trim from "lodash/trim";
import _omit from "lodash/omit";
import _includes from "lodash/includes";

import { uuidv4, DataBaseError, filterOutProps } from "../utils";

function validateFields(colName, field, cell) {
  let isValidVal = true;
  let errMsg = "";

  if (field.minlength || field.maxlength) {
    if (field.minlength && field.maxlength) {
      if (cell.length < field.minlength || cell.length > field.maxlength) {
        isValidVal = false;
        errMsg = "Value length not in given range.";
      }
    } else if (field.minlength && cell.length < field.minlength) {
      isValidVal = false;
      errMsg = "Value length is less than allowed length.";
    } else if (field.maxlength && cell.length > field.maxlength) {
      isValidVal = false;
      errMsg = "Value length is more than allowed length.";
    }
  }

  if (field.type === "enum") {
    if (!_includes(field.enum, cell)) {
      isValidVal = false;
      errMsg = "Unknown `enum` value.";
    }
  } else if (field.type === typeof cell) {
    if (field.match && !field.match.test(cell)) {
      isValidVal = false;
      errMsg = `Regexp for '${colName}' not matching.`;
    }
  } else {
    isValidVal = false;
    errMsg = `Field type mismatch. Expected '${
      field.type
    }', actual '${typeof cell}'`;
  }

  return { isValidVal, errMsg };
}

export default class BaseModel {
  constructor(db) {
    this._db = db;
  }

  _genId() {
    return uuidv4();
  }

  _getTimestamp() {
    return new Date();
  }

  _getTable() {
    const tab = this._tableName;

    return this._db.defaults({ [tab]: [] }).get(tab);
  }

  _validateRow(row, isUpdate) {
    const validatedRow = {};
    const fields = this._fields;
    let isValid = true;
    let errMsg = "";

    for (let f in fields) {
      const field = fields[f];

      if (_has(row, f)) {
        let cell = row[f] || field.default;
        let hasValidVal = true;

        if (!field.novalidation) {
          if (field.trim) cell = _trim(cell);

          if (field.lowercase) cell = cell.toLowerCase();

          const validations = validateFields(f, field, cell);

          if (validations.isValidVal) {
            // Ensure the row is unique
            if (field.unique) {
              const oldRow = this.findOne({ [f]: cell }, null, true);

              if (oldRow) {
                if (isUpdate) {
                  if (oldRow.id !== row.id) {
                    hasValidVal = false;
                    errMsg = "Duplicate value.";
                  }
                } else {
                  hasValidVal = false;
                  errMsg = "Duplicate value.";
                }
              }
            }
          } else {
            hasValidVal = validations.isValidVal;
            errMsg = validations.errMsg;
          }
        }

        if (hasValidVal) {
          validatedRow[f] = cell;
        } else {
          isValid = false;
          break;
        }
      } else if (field.required) {
        isValid = false;
        errMsg = `Missing a required field '${f}'.`;
        break;
      }
    }

    return { validatedRow, isValid, errMsg };
  }

  findOne(where, chainable, raw) {
    if (raw === true) return this._getTable().find(where).value();

    if (chainable) return this._getTable().find(where);

    return filterOutProps(this._getTable().find(where).value());
  }

  findById(id, chainable, raw) {
    if (raw === true) return this._getTable().find({ id }).value();

    if (chainable) return this._getTable().find({ id });

    return filterOutProps(this._getTable().find({ id }).value());
  }

  findAll(where, chainable, raw) {
    if (raw === true) return this._getTable().filter(where).value();

    if (chainable) return this._getTable().filter(where);

    return this._getTable()
      .filter(where)
      .map((r) => filterOutProps(r))
      .value();
  }

  count() {
    return this._getTable().size().value();
  }

  create(row) {
    const { validatedRow, isValid, errMsg } = this._validateRow(row);

    if (isValid) {
      const timestamp = this._getTimestamp();

      validatedRow.id = this._genId();
      validatedRow.createdAt = timestamp;
      validatedRow.updatedAt = timestamp;

      this._getTable().push(validatedRow).write();

      return filterOutProps(validatedRow);
    } else {
      throw new DataBaseError(errMsg);
    }
  }

  update(id, newRow) {
    const isUpdate = true;
    const oldRow = this.findOne({ id });

    if (oldRow) {
      const row = Object.assign({}, oldRow, newRow);
      const { validatedRow, isValid, errMsg } = this._validateRow(
        row,
        isUpdate
      );

      if (isValid) {
        validatedRow.updatedAt = this._getTimestamp();

        this._getTable().find({ id }).assign(validatedRow).write();

        return filterOutProps(validatedRow);
      } else {
        throw new DataBaseError(errMsg);
      }
    } else {
      throw new DataBaseError("Record doesnot exists.");
    }
  }

  delete(id) {
    return this._getTable().remove({ id }).write();
  }
}
