// 404 Not Found Handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Mongoose validation error handler
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  return {
    success: false,
    message: 'Validation Error',
    errors,
  };
};

// Mongoose duplicate key error handler
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    success: false,
    message: `${field} already exists`,
  };
};

// Mongoose cast error handler
const handleCastError = (err) => {
  return {
    success: false,
    message: `Invalid ${err.path}: ${err.value}`,
  };
};

// Enhanced error handler with specific error types
const enhancedErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const response = handleValidationError(err);
    return res.status(400).json(response);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const response = handleDuplicateKeyError(err);
    return res.status(400).json(response);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const response = handleCastError(err);
    return res.status(400).json(response);
  }

  // Default error response
  errorHandler(err, req, res, next);
};

module.exports = {
  notFound,
  errorHandler,
  enhancedErrorHandler,
};
