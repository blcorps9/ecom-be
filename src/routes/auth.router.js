import { Router } from "express";

import { authCtlr } from "../controllers";
import { validateReqSchema } from "../middlewares";
import { loginSchema, registerSchema } from "../schemas";

const router = Router();

export default function routes(app, isDev) {
  router.post(
    "/login",
    validateReqSchema(loginSchema, "body"),
    authCtlr.login(app, isDev)
  );

  router.post(
    "/register",
    validateReqSchema(registerSchema, "body"),
    authCtlr.register(app, isDev)
  );

  router.get("/logout", authCtlr.logout(app, isDev));

  return router;
}
