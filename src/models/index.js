export default function (db) {
  const User = require("./user.model").default;

  return { User: new User(db) };
}
