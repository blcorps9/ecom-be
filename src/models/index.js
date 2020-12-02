import User from "./user.model";
import Cards from "./cards.model";
import Carts from "./carts.model";
import Orders from "./orders.model";
import FavList from "./fav-list.model";
import Products from "./products.model";
import UserAddresses from "./user-addresses.model";
import Stripe from "./stripe.model";

export default function (db) {
  return {
    Stripe: new Stripe(db),
    User: new User(db),
    Cards: new Cards(db),
    Carts: new Carts(db),
    Orders: new Orders(db),
    FavList: new FavList(db),
    Products: new Products(db),
    UserAddresses: new UserAddresses(db),
  };
}
