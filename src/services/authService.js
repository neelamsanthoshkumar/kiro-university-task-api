const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { validateRegistrationData, validateLoginData } = require('../utils/validation');
const { sanitizeUserData } = require('../utils/sanitization');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user object with token
 * @throws {Error} If validation fails or email already exists
 */
async function registerUser(userData) {
  // Sanitize input
  const sanitized = sanitizeUserData(userData);
  
  // Validate input
  const validationError = validateRegistrationData(sanitized);
  if (validationError) {
    const error = new Error('Validation failed');
    error.code = 'VALIDATION_ERROR';
    error.details = validationError;
    throw error;
  }
  
  // Check if email already exists
  const existingUser = await userRepository.findUserByEmail(sanitized.email);
  if (existingUser) {
    const error = new Error('Email already registered');
    error.code = 'CONFLICT';
    throw error;
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(sanitized.password, 10);
  
  // Create user
  const user = await userRepository.createUser({
    email: sanitized.email,
    passwordHash,
    name: sanitized.name
  });
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    },
    token
  };
}

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} User object with token
 * @throws {Error} If validation fails or credentials are invalid
 */
async function loginUser(credentials) {
  // Validate input
  const validationError = validateLoginData(credentials);
  if (validationError) {
    const error = new Error('Validation failed');
    error.code = 'VALIDATION_ERROR';
    error.details = validationError;
    throw error;
  }
  
  // Find user by email
  const user = await userRepository.findUserByEmail(credentials.email.trim().toLowerCase());
  
  if (!user) {
    const error = new Error('Invalid email or password');
    error.code = 'UNAUTHORIZED';
    throw error;
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
  
  if (!isValidPassword) {
    const error = new Error('Invalid email or password');
    error.code = 'UNAUTHORIZED';
    throw error;
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    token
  };
}

module.exports = {
  registerUser,
  loginUser
};
