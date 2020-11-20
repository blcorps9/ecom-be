import { jwtExpirationInterval } from "../config";

export function login(app, isDev) {
  return async (req, res) => {
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

        return res.returnSuccess(user, "You are successfully logged in.");
      } else {
        return res.returnServerError("Username and password is required.");
      }
    } catch (err) {
      return res.returnServerError(err.message);
    }
  };
}

export function register(app, isDev) {
  return async (req, res) => {
    try {
      const user = await app.get("orm").User.create(req.body);
      const token = await app.get("orm").User.genToken(user.email);

      const options = {
        maxAge: jwtExpirationInterval,
        httpOnly: !isDev,
      };

      res.cookie("token", token, options);

      return res.returnCreated(user, "Successfully created new user.");
    } catch (err) {
      return res.returnServerError(err.message);
    }
  };
}

export function logout(app, isDev) {
  return async (req, res) => {
    try {
      const user = await req.getUser();
      const token = await app.get("orm").User.getExpiredToken(user.email);

      const options = {
        maxAge: 1,
        httpOnly: !isDev,
      };

      res.cookie("token", token, options);

      return res.returnSuccess(null, "Successfully logged out.");
    } catch (err) {
      return res.returnServerError(err.message);
    }
  };
}
