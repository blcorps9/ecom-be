export function getOrders(app, isDev) {
  return async (req, res) => {
    if (req.user) {
      const user = await req.getUser();

      if (user && user.id) {
        const myOrders = await app.get("orm").Orders.findAll({ user: user.id });

        return res.returnSuccess(myOrders);
      } else {
        return res.returnUnauthorized();
      }
    } else {
      return res.returnUnauthorized();
    }
  };
}

export function placeOrders(app, isDev) {
  return async (req, res) => {
    if (req.user) {
      const user = await req.getUser();

      if (user && user.id) {
        const myOrders = await app
          .get("orm")
          .Orders.create({ ...req.body, user: user.id });

        return res.returnSuccess(myOrders);
      } else {
        return res.returnUnauthorized();
      }
    } else {
      return res.returnUnauthorized();
    }
  };
}
