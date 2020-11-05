import _omit from "lodash/omit";

import { restrictedFields } from "../config";

export { default as logger } from "./logger";
export { default as DataBaseError } from "./db-error";

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

export function formatPrice(price) {
  return Number(price).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}

export function filterOutProps(obj = {}, props = []) {
  return _omit(obj, restrictedFields.concat(props));
}
