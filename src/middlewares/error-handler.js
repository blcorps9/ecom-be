export default function (app, isDev) {
  return (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode);

    res.json({
      isError: true,
      message: err.message,
    });
  };
}
