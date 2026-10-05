const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication token is required',
          details: {}
        }
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    // Token is invalid or expired
    console.error('Token verification failed:', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired authentication token',
        details: {}
      }
    });
  }
}

module.exports = {
  authenticateToken
};
