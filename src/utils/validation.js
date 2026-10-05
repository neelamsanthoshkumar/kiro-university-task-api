/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate task data
 * @param {Object} data - Task data to validate
 * @returns {Object|null} Validation errors object or null if valid
 */
function validateTaskData(data) {
  const errors = {};
  
  // Title validation
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }
  
  // Priority validation
  const validPriorities = ['low', 'medium', 'high'];
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
  }
  
  // Status validation (if provided)
  if (data.status) {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(data.status)) {
      errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
    }
  }
  
  // Due date validation
  if (data.dueDate !== undefined && data.dueDate !== null) {
    if (typeof data.dueDate !== 'string' || data.dueDate.trim() === '') {
      errors.dueDate = 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)';
    } else {
      const dueDate = new Date(data.dueDate);
      if (isNaN(dueDate.getTime())) {
        errors.dueDate = 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)';
      } else if (dueDate < new Date()) {
        errors.dueDate = 'Due date must be in the future';
      }
    }
  }
  
  // Description validation (if provided)
  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or less';
  }
  
  // Tags validation (if provided)
  if (data.tags) {
    if (!Array.isArray(data.tags)) {
      errors.tags = 'Tags must be an array of strings';
    } else if (data.tags.length > 10) {
      errors.tags = 'Maximum 10 tags allowed';
    } else if (!data.tags.every(tag => typeof tag === 'string')) {
      errors.tags = 'All tags must be strings';
    }
  }
  
  return Object.keys(errors).length > 0 ? { fields: errors } : null;
}

/**
 * Validate user registration data
 * @param {Object} data - User registration data
 * @returns {Object|null} Validation errors object or null if valid
 */
function validateRegistrationData(data) {
  const errors = {};
  
  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }
  
  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }
  
  return Object.keys(errors).length > 0 ? { fields: errors } : null;
}

/**
 * Validate login data
 * @param {Object} data - Login data
 * @returns {Object|null} Validation errors object or null if valid
 */
function validateLoginData(data) {
  const errors = {};
  
  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required';
  }
  
  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required';
  }
  
  return Object.keys(errors).length > 0 ? { fields: errors } : null;
}

/**
 * Validate status transition
 * @param {string} currentStatus - Current task status
 * @param {string} newStatus - New task status
 * @returns {boolean} True if transition is valid
 */
function isValidStatusTransition(currentStatus, newStatus) {
  const transitions = {
    'pending': ['in-progress', 'completed'],
    'in-progress': ['completed'],
    'completed': []
  };
  
  if (currentStatus === newStatus) return true;
  
  if (!Object.prototype.hasOwnProperty.call(transitions, currentStatus)) {
    return false;
  }
  
  return transitions[currentStatus].includes(newStatus);
}

module.exports = {
  isValidEmail,
  validateTaskData,
  validateRegistrationData,
  validateLoginData,
  isValidStatusTransition
};
