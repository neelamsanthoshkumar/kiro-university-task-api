const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Singleton database instance
let dbInstance = null;

/**
 * Get database instance
 * @returns {Promise<sqlite3.Database>} SQLite database instance
 */
function getDatabase() {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            reject(err);
          } else {
            dbInstance = db;
            resolve(db);
          }
        });
      }
    });
  });
}

/**
 * Initialize database schema
 * @param {sqlite3.Database} db - Database instance
 * @returns {Promise<void>}
 */
async function initializeSchema(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create tasks table
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          priority VARCHAR(10) NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
          status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed')),
          due_date DATETIME,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Create indexes for tasks
      db.run('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)');

      // Create notifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          task_id INTEGER NOT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          // Create index for notifications
          db.run('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)', (err) => {
            if (err) {
              reject(err);
            } else {
              console.log('✅ Database schema initialized successfully');
              resolve();
            }
          });
        }
      });
    });
  });
}

module.exports = {
  getDatabase,
  initializeSchema
};
