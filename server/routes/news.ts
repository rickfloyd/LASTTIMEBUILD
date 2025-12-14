import express from 'express';
import newsService from '../services/news';

const router = express.Router();

/**
 * GET /api/news/market
 * Get market news from NewsData.io
 */
router.get('/market', async (req, res) => {
  try {
    const { q } = req.query;
    const data = await newsService.getNews(q as string | undefined);
    res.json({ success: true, data, source: 'NewsData.io' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
