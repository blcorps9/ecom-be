import authRouter from "./auth.router";

export default function routes(app, isDev) {
  app.get("/", (req, res) => res.send("Ok"));

  app.use("/auth", authRouter(app, isDev));
}
