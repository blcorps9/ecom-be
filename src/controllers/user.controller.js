import _get from "lodash/get";
import _map from "lodash/map";
import _size from "lodash/size";
import _find from "lodash/find";
import _reduce from "lodash/reduce";
import _isEmpty from "lodash/isEmpty";

export function saveAddress(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const newAddr = req.body;

          newAddr.user = user.id;

          const savedAddr = await app.get("orm").UserAddresses.create(newAddr);

          return res.returnCreated(savedAddr);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function getAddresses(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const userAddrs = await app
            .get("orm")
            .UserAddresses.findAll({ user: user.id });

          return res.returnSuccess(userAddrs);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function updateAddress(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const { id } = req.params;
        const updatedAddr = await app
          .get("orm")
          .UserAddresses.update(id, req.body);

        return res.returnUpdated(updatedAddr);
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function deleteAddress(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const { id } = req.params;

        await app.get("orm").UserAddresses.delete(id);

        return res.returnDeleted();
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}

// Cards
export function saveCard(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const newCard = req.body;

          newCard.user = user.id;

          const savedCard = await app.get("orm").Cards.create(newCard);

          return res.returnCreated(savedCard);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function getCards(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const userCards = await app
            .get("orm")
            .Cards.findAll({ user: user.id });

          return res.returnSuccess(userCards);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function updateCard(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const { id } = req.params;

        const updatedCard = await app.get("orm").Cards.update(id, req.body);

        return res.returnUpdated(updatedCard);
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function deleteCard(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const { id } = req.params;

        await app.get("orm").Cards.delete(id);

        return res.returnDeleted();
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}

// Fav list
export function getMyFavList(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const favList = await app
            .get("orm")
            .FavList.findAll({ user: user.id });

          return res.returnSuccess(favList);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function addItemToMyFavList(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const mod = app.get("orm").FavList;
          const favList = await mod.findOne({ user: user.id });

          if (_isEmpty(favList)) {
            const updatedList = await mod.create({
              user: user.id,
              items: [req.body],
            });

            return res.returnSuccess(updatedList);
          } else {
            const updatedList = await mod.pushItem(
              { user: user.id },
              "items",
              req.body
            );

            return res.returnSuccess(updatedList);
          }
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function deleteItemFromMyFavList(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const updatedList = await app
            .get("orm")
            .FavList.removeItem({ user: user.id }, "items", req.params.id);

          return res.returnDeleted(updatedList);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}

// Cart
export function getMyCart(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const myCart = await app.get("orm").Carts.findAll({ user: user.id });

          return res.returnSuccess(myCart);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function addItemToMyCart(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const mod = app.get("orm").Carts;
          const userCart = await mod.findOne({ user: user.id });

          if (_isEmpty(userCart)) {
            const myCart = await mod.create({
              user: user.id,
              items: [req.body],
            });

            return res.returnSuccess(myCart);
          } else {
            const myCart = await mod.pushItem(
              { user: user.id },
              "items",
              req.body
            );

            return res.returnSuccess(myCart);
          }
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function updateItemInMyCart(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          if (_isEmpty(req.body)) {
            return res.returnServerError("Invalid payload.");
          } else {
            const myCart = await app
              .get("orm")
              .Carts.updateItem({ user: user.id }, "items", {
                ...req.body,
                id: req.params.id,
              });

            return res.returnSuccess(myCart);
          }
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
export function deleteItemFromMyCart(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const updatedCart = await app
            .get("orm")
            .Carts.removeItem({ user: user.id }, "items", req.params.id);

          return res.returnDeleted(updatedCart);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}

// Orders
export function getMyOrders(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const myOrders = await app
            .get("orm")
            .Orders.findAll({ user: user.id });

          return res.returnSuccess(myOrders);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}

// dashboard
export function dashboard(app, isDev) {
  return async (req, res) => {
    try {
      if (req.user) {
        const user = await req.getUser();

        if (user && user.id) {
          const payload = {
            profile: {},
            cartCount: 0,
            cart: {},
            cards: [],
            orders: [],
            favList: {},
            addresses: [],
          };

          try {
            const m = app.get("orm");

            payload.profile = await m.User.findById(user.id);
            const cart = await m.Carts.findOne({ user: user.id });
            const cartItems = _map(_get(cart, ["items"]), (i) => {
              const p = m.Products.findById(i.id);

              return { ...i, name: p.name, brand: p.brand, image: p.image };
            });

            payload.cart = { ...cart, items: cartItems };
            payload.cartCount = _reduce(
              _get(payload.cart, ["items"]),
              (p, c) => p + c.quantity,
              0
            );
            payload.cards = await m.Cards.findAll({ user: user.id });
            payload.orders = await m.Orders.findAll({ user: user.id });
            payload.favList = await m.FavList.findOne({ user: user.id });
            payload.addresses = await m.UserAddresses.findAll({
              user: user.id,
            });
          } catch (e) {}

          return res.returnSuccess(payload);
        } else {
          return res.returnUnauthorized();
        }
      } else {
        return res.returnUnauthorized();
      }
    } catch (e) {
      return res.returnServerError(e.message);
    }
  };
}
