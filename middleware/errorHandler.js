/**
 * Error handling middleware for Express
 */

// Custom error class
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error for debugging
  console.error('Error:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    statusCode: error.statusCode || 500,
    message: error.message,
    details: error.details || null,
  })

  // Default error response
  let statusCode = error.statusCode || 500
  let message = error.message || 'Internal Server Error'
  let details = error.details || null

  // Handle specific error types
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation Error'
    details = Object.values(err.errors).map((error) => error.message)
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyPattern)[0]
    message = `${field} already exists`
    details = null
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
    details = null
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
    details = null
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
    details = null
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = {
  ApiError,
  errorHandler,
  asyncHandler,
}
