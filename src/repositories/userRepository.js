const { getDatabase } = require('../config/database');

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.passwordHash - Hashed password
 * @param {string} userData.name - User name
 * @returns {Promise<Object>} Created user object
 */
async function createUser(userData) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`,
      [userData.email, userData.passwordHash, userData.name],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            email: userData.email,
            name: userData.name,
            createdAt: new Date().toISOString()
          });
        }
      }
    );
  });
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findUserByEmail(email) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, email, password_hash, name, created_at, updated_at FROM users WHERE email = ?`,
      [email],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
}

/**
 * Find user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findUserById(userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
