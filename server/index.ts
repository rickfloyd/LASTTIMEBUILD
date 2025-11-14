import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/crypto';
import stocksRoutes from './routes/stocks';
import newsRoutes from './routes/news';
import economicRoutes from './routes/economic';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/crypto', cryptoRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/economic', economicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    apis: {
      coingecko: 'connected',
      binance: 'connected',
      alphaVantage: 'connected',
      fred: 'connected',
      marketaux: 'connected'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Quantum Charts API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
