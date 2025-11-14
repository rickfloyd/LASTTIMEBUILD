import express, { Request, Response } from 'express';
import Parser from 'rss-parser';

const router = express.Router();
const parser = new Parser();

router.get('/feed', async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A feed URL must be provided.' });
  }

  try {
    const feed = await parser.parseURL(url);
    res.json(feed);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch or parse the RSS feed.' });
  }
});

export default router;
