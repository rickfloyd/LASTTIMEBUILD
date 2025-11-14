import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware } from '../middleware/auth';
import RealAPIService from '../../services/realApiService';

const router = Router();
const apiService = RealAPIService.getInstance();

// GET /api/market/stocks/:symbol
router.get('/stocks/:symbol', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const data = await apiService.getStockData(symbol);
    res.json(data);
  } catch (error) {
    console.error('Stock data error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// GET /api/market/crypto/:symbol
router.get('/crypto/:symbol', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const data = await apiService.getCryptoData(symbol);
    res.json(data);
  } catch (error) {
    console.error('Crypto data error:', error);
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
});

// GET /api/market/forex/:pair
router.get('/forex/:pair', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { pair } = req.params;
    const data = await apiService.getForexData(pair);
    res.json(data);
  } catch (error) {
    console.error('Forex data error:', error);
    res.status(500).json({ error: 'Failed to fetch forex data' });
  }
});

export default router;