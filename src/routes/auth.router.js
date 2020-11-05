import { Router } from "express";

import { authSchema } from "../schemas";
import { authCtlr } from "../controllers";
import { validateReqSchema } from "../middlewares";

const router = Router();

export default function routes(app, isDev) {
  router.post(
    "/login",
    validateReqSchema(authSchema.loginSchema, "body"),
    authCtlr.login(app, isDev)
  );

  router.get("/user", (req, res) => {
    res.status(200).send(req?.user?.sub);
  });

  router.post(
    "/register",
    validateReqSchema(authSchema.registerSchema, "body"),
    authCtlr.register(app, isDev)
  );

  return router;
}
