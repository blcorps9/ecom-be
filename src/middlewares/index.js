import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";

import cors from "./cors";
import { morganLogLevel } from "../config";

export { default as jwt } from "./jwt";
export { default as notFound } from "./not-found";
export { default as errorHandler } from "./error-handler";
export { default as validateReqSchema } from "./validate-req";

export function setupMiddlewares(app, isDev) {
  app.use(cors());
  app.use(helmet());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(compression({ threshold: 512 }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan(morganLogLevel));
}
