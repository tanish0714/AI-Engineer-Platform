const errorHandler = (err, req, res, next) => {
  console.error("========== ERROR ==========");
  console.error(err);
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default errorHandler;