/**
 * Global error handling middleware
 * Must be registered as the last middleware in Express app
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
function globalErrorHandler(err, req, res, next) {
  // Log the full error for debugging
  console.error('Unhandled error:', {
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  
  // Return generic error response
  return res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      details: {
        requestId: req.id || 'unknown'
      }
    }
  });
}

module.exports = {
  globalErrorHandler
};
