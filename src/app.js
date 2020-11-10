import "core-js/stable";
import "regenerator-runtime/runtime";

import path from "path";
import express from "express";

import initDB from "./db";
import routes from "./routes";
import models from "./models";
import { logger } from "./utils";
import { port, isDev } from "./config";
import * as middlewares from "./middlewares";

export default function startServer() {
  const app = express();

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // Add midllewares
  middlewares.setupMiddlewares(app, isDev);

  // setup `public` dir
  app.use(express.static(path.join(process.cwd(), "public")));

  // JWT middleware
  app.use(middlewares.jwt(app, isDev));

  // Req/Res helper middlewares
  app.use(middlewares.reqRes(app, isDev));

  // Add routes
  routes(app, isDev);

  // 404 middleware
  app.use(middlewares.notFound(app, isDev));

  // error handler middleware
  app.use(middlewares.errorHandler(app, isDev));

  initDB(app, isDev).then(async (db) => {
    const orm = models(db);

    app.set("orm", orm);

    app.listen(port, (err) => {
      if (err) {
        throw err;
      }

      logger.info(`App is listening on ${port}.`);
    });
  });
}
