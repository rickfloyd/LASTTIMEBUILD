import dotenv from 'dotenv';
import QuantumChartsServer from './server';

// Load environment variables
dotenv.config();

// Create and start server
const server = new QuantumChartsServer();

// Start the server
server.start().catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});