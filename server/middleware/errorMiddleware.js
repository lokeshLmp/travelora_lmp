/**
 * Centralized Error Handling Middleware
 */
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development debugging
  console.error('API Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found with that reference ID';
    error = new Error(message);
    res.status(404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    res.status(400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new Error(message);
    res.status(400);
  }

  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    success: false,
    message: error.message || 'Server encountered an unexpected error'
  });
};
