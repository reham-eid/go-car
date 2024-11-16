// Global Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  // console.error(err.stack);

  // Check if the error has a statusCode property, if not, default to 500
  const statusCode = err.statusCode || 500;

  // Send the error response
  res.status(statusCode).json({
    status: "error",
    statusCode: statusCode,
    message: err.message,
    data: err.data, // If you attached data to the error object
  });
};

export default errorHandler;
