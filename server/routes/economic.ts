import express from 'express';

const router = express.Router();

/**
 * GET /api/economic/fred/:series
 * Get FRED economic data (placeholder)
 */
router.get('/fred/:series', async (req, res) => {
  try {
    const { series } = req.params;
    
    // Placeholder response - integrate FRED with API key
    res.json({
      success: true,
      data: {
        series: series.toUpperCase(),
        note: 'Add FRED_API_KEY to .env for live data',
        freeApiKey: 'Get free key at https://fred.stlouisfed.org/docs/api/api_key.html'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
