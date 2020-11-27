import _reduce from "lodash/reduce";

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
        const { cart, address, card } = req.body;

        const userCart = await app.get("orm").Carts.findById(cart);

        if (userCart) {
          const today = new Date();
          today.setDate(today.getDate() + 7);
          const tax = 0.02;
          const discount = 0.0;
          const items = userCart.items;
          const subTotal = _reduce(
            items,
            (prev, { price, quantity }) => {
              return prev + price * quantity;
            },
            0.0
          );
          const total = subTotal + subTotal * tax - discount;
          const order = {
            tax,
            card,
            items,
            total,
            address,
            discount,
            user: user.id,
            deliveryDate: today.toJSON(),
          };

          const myOrders = await app.get("orm").Orders.create(order);

          const deletedCart = await app.get("orm").Carts.delete(cart);

          return res.returnSuccess(myOrders);
        }

        return res.returnServerError();
      } else {
        return res.returnUnauthorized();
      }
    } else {
      return res.returnUnauthorized();
    }
  };
}
