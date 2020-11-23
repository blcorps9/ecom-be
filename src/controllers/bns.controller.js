export function search(app, isDev) {
  return async (req, res) => {
    try {
      const where = {};
      const { category, name } = req.query;

      if (name) where.name = name;
      if (category) where.category = category;

      const products = await app.get("orm").Products.search(where);

      return res.returnSuccess(products);
    } catch (err) {
      return res.returnServerError(err.message);
    }
  };
}

export function getProduct(app, isDev) {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const product = await app.get("orm").Products.findById(id);

      return res.returnSuccess(product);
    } catch (err) {
      return res.returnServerError(err.message);
    }
  };
}

export function getProductsByCategory(app, isDev) {
  return async (req, res) => {
    try {
      const { cat } = req.params;
      const products = await app.get("orm").Products.findAllByCategory(cat);

      return res.returnSuccess(products);
    } catch (err) {
      return res.returnServerError(err.message);
    }
  };
}
