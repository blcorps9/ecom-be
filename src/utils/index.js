import fs from "fs";
import path from "path";
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

export function getRandomNum(len) {
  return Math.floor(Math.random() * Math.pow(9, len)) + Math.pow(1, len);
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

export function walkSync(dir, fileList, rootDir, validFileFormats) {
  let baseDir = rootDir || dir;
  let files = fs.readdirSync(dir);

  fileList = fileList || [];
  files.forEach((file) => {
    let stats = fs.statSync(path.join(dir, file));

    if (stats.isDirectory()) {
      fileList = walkSync(
        path.join(dir, file),
        fileList,
        baseDir,
        validFileFormats
      );
    } else if (
      !validFileFormats ||
      validFileFormats.indexOf(path.extname(file)) !== -1
    ) {
      const relPath = path.relative(baseDir, path.join(dir, file));

      fileList.push(relPath.replace(/\\/g, "/"));
    }
  });

  return fileList;
}

export function isValidCardNumber(num = "") {
  const digits = String(num)
    .replace(/[^0-9]/g, "")
    .split("")
    .map(Number);

  const len = digits.length;
  const parity = len % 2;
  let sum = digits[len - 1];

  for (let i = len - 2; i > -1; i--) {
    let d = digits[i];

    if (i % 2 === parity) {
      d *= 2;

      if (d > 9) d -= 9;
    }

    sum += d;
  }

  return sum % 10 === 0;
}
