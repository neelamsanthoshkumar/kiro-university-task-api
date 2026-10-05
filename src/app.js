const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { globalErrorHandler } = require('./middleware/errorHandler');

/**
 * Create and configure Express application
 * @returns {express.Application} Configured Express app
 */
function createApp() {
  const app = express();
  
  // CORS configuration - Allow all origins for testing
  app.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
  }));
  
  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Serve static HTML test page at /test
  app.get('/test', (req, res) => {
    res.sendFile('test.html', { root: './' });
  });
  
  // Root endpoint - API info
  app.get('/', (req, res) => {
    res.json({
      success: true,
      data: {
        name: 'Task Management API',
        version: '1.0.0',
        description: 'Kiro University Challenge Project',
        endpoints: {
          test_interface: 'http://localhost:3000/test',
          health: 'http://localhost:3000/health',
          api_base: 'http://localhost:3000/api',
          auth: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login'
          },
          tasks: {
            list: 'GET /api/tasks',
            create: 'POST /api/tasks',
            get: 'GET /api/tasks/:id',
            update: 'PUT /api/tasks/:id',
            delete: 'DELETE /api/tasks/:id'
          },
          notifications: {
            list: 'GET /api/notifications',
            markRead: 'PATCH /api/notifications/:id/read'
          }
        }
      },
      error: null
    });
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString()
      },
      error: null
    });
  });
  
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/notifications', notificationRoutes);
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
        details: {}
      }
    });
  });
  
  // Global error handler (must be last)
  app.use(globalErrorHandler);
  
  return app;
}

module.exports = { createApp };
