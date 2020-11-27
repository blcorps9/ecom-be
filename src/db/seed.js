import fs from "fs";
import path from "path";
import _get from "lodash/get";
import _map from "lodash/map";
import _range from "lodash/range";
import _sample from "lodash/sample";
import _filter from "lodash/filter";
import _compact from "lodash/compact";
import _flatMap from "lodash/flatMap";
import _unionBy from "lodash/unionBy";
import _groupBy from "lodash/groupBy";
import _includes from "lodash/includes";
import _startCase from "lodash/startCase";
import _kebabCase from "lodash/kebabCase";
import _sampleSize from "lodash/sampleSize";

import { walkSync, uuidv4 } from "../utils";
import { dbName } from "../config";

const cwd = process.cwd();

const stocks = _range(3, 100, 2);
const reviews = _range(3, 555, 7);
const shoeSizes = _range(5, 13, 1);
const prices = _range(99, 2000, 50);
const shirtSizes = _range(38, 51, 2);
const ratings = _range(1, 5.5, 0.5);
const brands = ["Adidas", "Puma", "Nike", "Levis"];
const colors = [
  "Blue",
  "Cobalt",
  "Green",
  "Purple",
  "Red",
  "White",
  "Black",
  "Grey",
  "Khaki",
  "Yellow",
];

async function readImages() {
  const extensions = [".jpg", ".jpeg"];
  const categoriesDir = path.join(cwd, "public", "images", "categories");
  const imagesCategory = walkSync(categoriesDir, [], categoriesDir, extensions);

  return {
    categories: _groupBy(imagesCategory, (i) => i.split("/")[0]),
  };
}

function getBrandName(name) {
  const brand = brands.find((b) => {
    const rg = new RegExp(b, "i");

    return rg.test(name);
  });

  return brand || _sample(brands);
}

function formProduct({ category, name, brand, image }) {
  const id = uuidv4();
  const timestamp = new Date();

  const product = {
    id,
    image,
    brand,
    createdAt: timestamp,
    updatedAt: timestamp,
    name: _startCase(name),
    price: _sample(prices),
    stock: _sample(stocks),
    ratings: _sample(ratings),
    reviews: _sample(reviews),
    category: _startCase(category),
    categoryPage: `/cat/${category}`,
    detailsPage: `/prod/${id}/${category}/${_kebabCase(name)}`,
  };

  switch (category.toLowerCase()) {
    case "shoes": {
      product.sizes = _sampleSize(shoeSizes, 4)
        .sort((a, b) => a - b)
        .map(String);
      product.colors = _sampleSize(colors, 4).sort();

      break;
    }
    case "shirts": {
      product.sizes = _sampleSize(shirtSizes, 4)
        .sort((a, b) => a - b)
        .map(String);
      product.colors = _sampleSize(colors, 4).sort();

      break;
    }
    default:
      break;
  }

  return product;
}

async function seed() {
  const { categories } = await readImages();
  let oldRecords = { products: [] };

  if (fs.existsSync(path.join(cwd, dbName))) {
    oldRecords = JSON.parse(fs.readFileSync(path.join(cwd, dbName), "utf-8"));
  }

  const oldProducts = _map(_get(oldRecords, ["products"], []), "image");

  // List of newly added products only
  const products = _compact(
    _flatMap(categories, (items, cat) => {
      return _map(items, (i) => {
        if (!_includes(oldProducts, `/images/categories/${i}`)) {
          const name = path.basename(i, path.extname(i));

          return formProduct({
            name,
            category: cat,
            brand: getBrandName(name),
            image: `/images/categories/${i}`,
          });
        }
      });
    })
  );

  if (products.length) {
    oldRecords.products = [].concat(
      _get(oldRecords, ["products"], []),
      products
    );

    fs.writeFileSync(
      path.join(cwd, dbName),
      JSON.stringify(oldRecords, null, 2)
    );
  }
}

seed().then(() => {
  console.log("Successfully done!");
});
