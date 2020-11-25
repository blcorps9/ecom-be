import _get from "lodash/get";
import _has from "lodash/has";
import _map from "lodash/map";
import _trim from "lodash/trim";
import _omit from "lodash/omit";
import _filter from "lodash/filter";
import _includes from "lodash/includes";
import _findIndex from "lodash/findIndex";

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
    errMsg = `Field '${colName}' type mismatch. Expected '${
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
        let cell = row[f];
        let hasValidVal = true;

        if (field.default && !cell) {
          cell = field.default;
        }

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
                    errMsg = `Duplicate value for field '${f}'.`;
                  }
                } else {
                  hasValidVal = false;
                  errMsg = `Duplicate value for field '${f}'.`;
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

  findMany(list, chainable, raw) {
    if (raw === true) {
      return this._getTable()
        .filter((p) => list.includes(p.id))
        .value();
    }

    if (chainable) return this._getTable().filter((p) => list.includes(p.id));

    return this._getTable()
      .filter((p) => list.includes(p.id))
      .map(filterOutProps)
      .value();
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

        return filterOutProps({ ...validatedRow, id });
      } else {
        throw new DataBaseError(errMsg);
      }
    } else {
      throw new DataBaseError("Record doesnot exists.");
    }
  }

  async delete(id) {
    const deleted = await this._getTable().remove({ id }).write();

    return deleted;
  }

  search(opts = {}) {
    return this._getTable()
      .filter((row) => {
        const props = Object.keys(opts);

        for (let p of props) {
          if (_has(row, p)) {
            if (!_includes(row[p].toLowerCase(), opts[p])) {
              return false;
            }
          } else {
            return false;
          }
        }

        return true;
      })
      .value();
  }

  async pushItem(where, prop, newItem) {
    try {
      const oldRecord = await this.findOne(where);

      if (oldRecord) {
        const newRecord = { ...oldRecord };
        newRecord.updatedAt = this._getTimestamp();

        const existingItemIndex = _findIndex(
          _get(newRecord, ["items"], []),
          (i) => i && i.id === newItem.id
        );

        if (existingItemIndex > -1) {
          newRecord[prop][existingItemIndex] = {
            ...newRecord[prop][existingItemIndex],
            ...newItem,
          };
        } else {
          newRecord[prop] = [...newRecord[prop], newItem];
        }

        return this._getTable().find(where).assign(newRecord).write();
      } else {
        throw new DataBaseError("No record found");
      }
    } catch (e) {
      throw new DataBaseError(e.message);
    }
  }

  async updateItem(where, prop, newItem) {
    try {
      const oldRecord = await this.findOne(where);
      const newRecord = { ...oldRecord };

      newRecord.updatedAt = this._getTimestamp();
      newRecord[prop] = _map(newRecord[prop], (i) => {
        if (i.id && i.id === newItem.id) {
          return Object.assign({}, i, newItem);
        }

        return i;
      });

      return this._getTable().find(where).assign(newRecord).write();
    } catch (e) {
      throw new DataBaseError(e.message);
    }
  }

  async removeItem(where, prop, itemId) {
    try {
      const oldRecord = await this.findOne(where);
      const newRecord = { ...oldRecord };

      newRecord.updatedAt = this._getTimestamp();
      newRecord[prop] = _filter(newRecord[prop], (i) => {
        return i.id && i.id !== itemId;
      });

      return this._getTable().find(where).assign(newRecord).write();
    } catch (e) {
      throw new DataBaseError(e.message);
    }
  }
}
