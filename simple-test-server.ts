// Simple test server
import express from 'express';

const app = express();
const port = 3002; // Use different port

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Simple test server working!', 
    timestamp: new Date().toISOString() 
  });
});

app.listen(port, () => {
  console.log(`🧪 Simple test server running on http://localhost:${port}/test`);
});

console.log('Starting simple test server...');