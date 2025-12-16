import express from 'express';
import stocksService from '../services/stocks';

const router = express.Router();

/**
 * GET /api/stocks/quote/:symbol
 * Get stock quote from Alpha Vantage
 */
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await stocksService.getQuote(symbol);
    res.json({ success: true, data, source: 'Alpha Vantage' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
