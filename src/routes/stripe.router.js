import { Router } from "express";

import { stripeCtlr } from "../controllers";

const router = Router();

export default function routes(app, isDev) {
  router.post("/payment", stripeCtlr.makePayment(app, isDev));

  return router;
}
