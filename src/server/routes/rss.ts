import { Router, Request, Response } from 'express';
import RSSService from '../../services/rssService';

const router = Router();
const rss = RSSService.getInstance();

// GET /api/rss/category/:category
router.get('/category/:category', async (req: Request, res: Response) => {
  const { category } = req.params;
  const limit = parseInt(String(req.query.limit ?? '30'), 10);
  try {
    const items = await rss.getByCategory(category, limit);
    res.json(items);
  } catch (e) {
    console.error('RSS category error', e);
    res.status(500).json({ error: 'Failed to fetch category feed' });
  }
});

// GET /api/rss/symbol/:symbol
router.get('/symbol/:symbol', async (req: Request, res: Response) => {
  const { symbol } = req.params;
  const limit = parseInt(String(req.query.limit ?? '20'), 10);
  try {
    const items = await rss.getSymbolNews(symbol, limit);
    res.json(items);
  } catch (e) {
    console.error('RSS symbol error', e);
    res.status(500).json({ error: 'Failed to fetch symbol feed' });
  }
});

export default router;