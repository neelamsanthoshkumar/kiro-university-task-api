const authService = require('../services/authService');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function register(req, res) {
  try {
    const result = await authService.registerUser(req.body);
    
    return res.status(201).json({
      success: true,
      data: result,
      error: null
    });
    
  } catch (error) {
    console.error('Error registering user:', {
      email: req.body?.email,
      error: error.message
    });
    
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
    }
    
    if (error.code === 'CONFLICT') {
      return res.status(409).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message,
          details: {}
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to register user. Please try again later.',
        details: {}
      }
    });
  }
}

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function login(req, res) {
  try {
    const result = await authService.loginUser(req.body);
    
    return res.json({
      success: true,
      data: result,
      error: null
    });
    
  } catch (error) {
    console.error('Login error:', {
      email: req.body?.email,
      timestamp: new Date().toISOString()
    });
    
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
    }
    
    if (error.code === 'UNAUTHORIZED') {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message,
          details: {}
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Login failed. Please try again later.',
        details: {}
      }
    });
  }
}

module.exports = {
  register,
  login
};
