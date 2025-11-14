import DatabaseConnection from './models';

// Database configuration
export const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum-platforms',
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0,
  }
};

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    const db = DatabaseConnection.getInstance();
    await db.connect(dbConfig.uri);
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async (): Promise<void> => {
  try {
    const db = DatabaseConnection.getInstance();
    await db.disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};

// Check database connection status
export const isDatabaseConnected = (): boolean => {
  const db = DatabaseConnection.getInstance();
  return db.getConnectionStatus();
};

export default DatabaseConnection;