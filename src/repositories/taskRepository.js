const { getDatabase } = require('../config/database');

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>} Created task object
 */
async function createTask(taskData) {
  const db = await getDatabase();
  
  const tagsJson = taskData.tags ? JSON.stringify(taskData.tags) : null;
  
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO tasks (user_id, title, description, priority, status, due_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        taskData.userId,
        taskData.title,
        taskData.description || null,
        taskData.priority,
        taskData.status || 'pending',
        taskData.dueDate || null,
        tagsJson
      ],
      async function(err) {
        if (err) {
          reject(err);
        } else {
          try {
            const task = await findTaskById(this.lastID, taskData.userId);
            resolve(task);
          } catch (findErr) {
            reject(findErr);
          }
        }
      }
    );
  });
}

/**
 * Find task by ID
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID (for ownership check)
 * @returns {Promise<Object|null>} Task object or null
 */
async function findTaskById(taskId, userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
      [taskId, userId],
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
 * Find all tasks for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of tasks
 */
async function findTasksByUserId(userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
}

/**
 * Update task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated task or null
 */
async function updateTask(taskId, userId, updates) {
  const db = await getDatabase();
  
  const fields = [];
  const values = [];
  
  if (updates.title !== undefined) {
    fields.push('title = ?');
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }
  if (updates.priority !== undefined) {
    fields.push('priority = ?');
    values.push(updates.priority);
  }
  if (updates.status !== undefined) {
    fields.push('status = ?');
    values.push(updates.status);
  }
  if (updates.dueDate !== undefined) {
    fields.push('due_date = ?');
    values.push(updates.dueDate);
  }
  if (updates.tags !== undefined) {
    fields.push('tags = ?');
    values.push(JSON.stringify(updates.tags));
  }
  
  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(taskId, userId);
  
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values,
      async function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null);
        } else {
          const task = await findTaskById(taskId, userId);
          resolve(task);
        }
      }
    );
  });
}

/**
 * Delete task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if deleted
 */
async function deleteTask(taskId, userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
      [taskId, userId],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      }
    );
  });
}

module.exports = {
  createTask,
  findTaskById,
  findTasksByUserId,
  updateTask,
  deleteTask
};
