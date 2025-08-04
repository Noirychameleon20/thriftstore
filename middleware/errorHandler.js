const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry found';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referenced record does not exist';
  } else if (err.message && err.message.includes('jwt')) {
    statusCode = 401;
    message = 'Invalid or expired token';
  } else if (err.message && err.message.includes('multer')) {
    statusCode = 400;
    message = err.message;
  } else if (err.status) {
    // If error has a status property, use it
    statusCode = err.status;
    message = err.message || 'Error occurred';
  } else if (err.message) {
    // If error has a message, use it but keep 500 status
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler; 