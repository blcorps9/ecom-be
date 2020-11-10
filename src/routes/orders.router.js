import { Router } from "express";

import { ordersCtlr } from "../controllers";
import { validateReqSchema } from "../middlewares";
import { saveOrderSchema } from "../schemas";

const router = Router();

export default function routes(app, isDev) {
  router.get("/", ordersCtlr.getOrders(app, isDev));

  router.post(
    "/",
    validateReqSchema(saveOrderSchema, "body"),
    ordersCtlr.placeOrders(app, isDev)
  );

  return router;
}
