import jwt from "express-jwt";
import _get from "lodash/get";

import publicPaths from "../routes/public-paths";
import { jwtSecret, jwtAlgorithm, jwtExpirationInterval } from "../config";

export default function (app, isDev) {
  const opts = {
    secret: jwtSecret,
    algorithms: [jwtAlgorithm],
    expiresIn: jwtExpirationInterval,
    getToken: (req) => _get(req, ["cookies", "token"]),
  };

  return jwt(opts).unless({ path: publicPaths });
}
