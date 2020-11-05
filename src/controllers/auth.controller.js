import { jwtExpirationInterval } from "../config";

export function login(app, isDev) {
  return async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (username && password) {
        const token = await app.get("orm").User.login(username, password);
        const user = await app.get("orm").User.findOne({ email: username });

        const options = {
          maxAge: jwtExpirationInterval,
          httpOnly: !isDev,
        };

        res.cookie("token", token, options);

        return res
          .status(200)
          .send({ message: "You are successfully logged in.", user });
      } else {
        next(new Error("Username and password is required."));
      }
    } catch (err) {
      next(err);
    }
  };
}

export function register(app, isDev) {
  return (req, res) => {
    console.log("req =-----> ", req.body);

    res.status(200).send({ register: 1234 });
  };
}
