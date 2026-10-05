require('dotenv').config();
const { getDatabase, initializeSchema } = require('./database');

/**
 * Setup database schema
 * Run this script with: npm run db:setup
 */
async function setupDatabase() {
  try {
    console.log('📦 Setting up database...');
    const db = await getDatabase();
    await initializeSchema(db);
    console.log('✅ Database setup complete!');
    db.close();
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
