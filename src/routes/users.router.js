import { Router } from "express";

import { userCtlr } from "../controllers";
import { validateReqSchema } from "../middlewares";
import {
  saveAddressSchema,
  updateAddressSchema,
  saveCardSchema,
  updateCardSchema,
  saveItemToFavListSchema,
  addToCartItemSchema,
  updateCartItemSchema,
} from "../schemas";

const router = Router();

export default function routes(app, isDev) {
  // Addresses
  router.get("/addresses", userCtlr.getAddresses(app, isDev));
  router.post(
    "/addresses",
    validateReqSchema(saveAddressSchema, "body"),
    userCtlr.saveAddress(app, isDev)
  );
  router.put(
    "/addresses/:id",
    validateReqSchema(updateAddressSchema, "body"),
    userCtlr.updateAddress(app, isDev)
  );
  router.delete("/addresses/:id", userCtlr.deleteAddress(app, isDev));

  // Cards
  router.get("/cards", userCtlr.getCards(app, isDev));
  router.post(
    "/cards",
    validateReqSchema(saveCardSchema, "body"),
    userCtlr.saveCard(app, isDev)
  );
  router.put(
    "/cards/:id",
    validateReqSchema(updateCardSchema, "body"),
    userCtlr.updateCard(app, isDev)
  );
  router.delete("/cards/:id", userCtlr.deleteCard(app, isDev));

  // Favorite List
  router.get("/shopping-list", userCtlr.getMyFavList(app, isDev));
  router.post(
    "/shopping-list/add",
    validateReqSchema(saveItemToFavListSchema, "body"),
    userCtlr.addItemToMyFavList(app, isDev)
  );
  router.delete(
    "/shopping-list/remove/:id",
    userCtlr.deleteItemFromMyFavList(app, isDev)
  );

  // Carts
  router.get("/shopping-cart", userCtlr.getMyCart(app, isDev));
  router.post(
    "/shopping-cart/add",
    validateReqSchema(addToCartItemSchema, "body"),
    userCtlr.addItemToMyCart(app, isDev)
  );
  router.put(
    "/shopping-cart/:id",
    validateReqSchema(updateCartItemSchema, "body"),
    userCtlr.updateItemInMyCart(app, isDev)
  );
  router.delete(
    "/shopping-cart/:id",
    userCtlr.deleteItemFromMyCart(app, isDev)
  );

  // Carts
  router.get("/orders", userCtlr.getMyOrders(app, isDev));

  return router;
}
