// property ~ body, query
export default function validateReqSchema(schema, property) {
  return function (req, res, next) {
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error, value } = schema.validate(req[property], options);

    if (error) {
      next(
        new Error(
          `ValidationError: ${error.details.map((x) => x.message).join(", ")}`
        )
      );
    } else {
      req[property] = value;
      next();
    }
  };
}
