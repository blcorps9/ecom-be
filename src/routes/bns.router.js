import { Router } from "express";

import { bnsCtlr } from "../controllers";

const router = Router();

export default function routes(app, isDev) {
  router.get("/search", bnsCtlr.search(app, isDev));

  router.get("/product/:id", bnsCtlr.getProduct(app, isDev));

  router.get("/category/:cat", bnsCtlr.getProductsByCategory(app, isDev));

  return router;
}
