import express from 'express';

const router = express.Router();

/**
 * GET /api/stocks/quote/:symbol
 * Get stock quote (placeholder for Alpha Vantage)
 */
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Placeholder response - integrate Alpha Vantage with API key
    res.json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        note: 'Add ALPHA_VANTAGE_API_KEY to .env for live data',
        freeApiKey: 'Get free key at https://www.alphavantage.co/support/#api-key'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
