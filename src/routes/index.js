import authRouter from "./auth.router";
import bnsRouter from "./bns.router";
import usersRouter from "./users.router";
import ordersRouter from "./orders.router";

export default function routes(app, isDev) {
  app.get("/", (req, res) => res.send("Ok"));

  app.use("/bns", bnsRouter(app, isDev));
  app.use("/auth", authRouter(app, isDev));
  app.use("/users", usersRouter(app, isDev));
  app.use("/orders", ordersRouter(app, isDev));
}
