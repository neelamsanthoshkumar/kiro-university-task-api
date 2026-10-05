require('dotenv').config();
const { createApp } = require('./app');
const { getDatabase } = require('./config/database');

/**
 * Start the server
 */
async function startServer() {
  try {
    // Validate required environment variables
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is required');
      process.exit(1);
    }
    
    // Get database connection (schema already initialized by db:setup)
    console.log('📦 Connecting to database...');
    await getDatabase();
    console.log('✅ Database connected');
    
    // Create Express app
    const app = createApp();
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Task Management API is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API base URL: http://localhost:${PORT}/api`);
      console.log(`\n📚 Available endpoints:`);
    console.log(`   POST /api/auth/register - Register new user`);
    console.log(`   POST /api/auth/login - Login user`);
    console.log(`   GET  /api/tasks - Get all tasks`);
    console.log(`   POST /api/tasks - Create new task`);
    console.log(`   GET  /api/tasks/:id - Get task by ID`);
    console.log(`   PUT  /api/tasks/:id - Update task`);
    console.log(`   DELETE /api/tasks/:id - Delete task`);
    console.log(`   GET  /api/notifications - Get notifications`);
    console.log(`   PATCH /api/notifications/:id/read - Mark as read`);
  });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();
