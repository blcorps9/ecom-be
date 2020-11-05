export default function (app, isDev) {
  return (req, res, next) => {
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);

    res.status(404);

    next(error);
  };
}
