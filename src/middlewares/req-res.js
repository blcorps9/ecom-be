function onUnauthorized() {
  return this.status(401).send({ isError: true, message: "Unauthorized" });
}
function onCreated(data, msg) {
  return this.status(201).send({
    data,
    message: msg || "Successfully saved a new record",
  });
}
function onUpdated(data, msg) {
  return this.status(200).send({
    data,
    message: msg || "Successfully updated a record",
  });
}
function onDeleted(data, msg) {
  const payload = { message: msg || "Successfully deleted a record" };

  if (data) payload.data = data;

  return this.status(200).send(payload);
}
function onSuccess(data, msg) {
  const payload = { data };

  if (msg) payload.message = msg;

  return this.status(200).send(payload);
}
function onServerError(msg) {
  return this.status(500).send({
    isError: true,
    message: msg || "Something went wrong.",
  });
}

async function getUser(app, { email, id }) {
  const user = await app.get("orm").User.findOne({ email, id });

  return user;
}

export default function (app, isDev) {
  return (req, res, next) => {
    // Request middleware
    req.getUser = () => getUser(app, req && req.user);

    // Response middleware
    res.returnCreated = onCreated;
    res.returnUpdated = onUpdated;
    res.returnDeleted = onDeleted;
    res.returnSuccess = onSuccess;
    res.returnServerError = onServerError;
    res.returnUnauthorized = onUnauthorized;

    next();
  };
}
