import express from 'express';

const router = express.Router();

/**
 * GET /api/news/market
 * Get market news with sentiment (placeholder for MarketAux)
 */
router.get('/market', async (req, res) => {
  try {
    // Placeholder response - integrate MarketAux with API key
    res.json({
      success: true,
      data: {
        note: 'Add MARKETAUX_API_KEY to .env for live news',
        freeApiKey: 'Get free key at https://www.marketaux.com/',
        features: ['Sentiment analysis', 'Ticker tagging', 'Real-time news']
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
