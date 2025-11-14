import express from 'express';
import coinGeckoService from '../services/coingecko';
import binanceService from '../services/binance';

const router = express.Router();

/**
 * GET /api/crypto/prices
 * Get current crypto prices from CoinGecko
 */
router.get('/prices', async (req, res) => {
  try {
    const { coins } = req.query;
    const coinIds = coins ? (coins as string).split(',') : undefined;
    const prices = await coinGeckoService.getPrices(coinIds);
    res.json({ success: true, data: prices, source: 'CoinGecko' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/trending
 * Get trending coins from CoinGecko
 */
router.get('/trending', async (req, res) => {
  try {
    const trending = await coinGeckoService.getTrending();
    res.json({ success: true, data: trending, source: 'CoinGecko' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/chart/:coinId
 * Get market chart data from CoinGecko
 */
router.get('/chart/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const { days } = req.query;
    const chart = await coinGeckoService.getMarketChart(coinId, days ? parseInt(days as string) : 7);
    res.json({ success: true, data: chart, source: 'CoinGecko' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/binance/ticker/:symbol
 * Get Binance ticker data
 */
router.get('/binance/ticker/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const ticker = await binanceService.getTicker(symbol);
    res.json({ success: true, data: ticker, source: 'Binance' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/binance/klines/:symbol
 * Get Binance candlestick data
 */
router.get('/binance/klines/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval, limit } = req.query;
    const klines = await binanceService.getKlines(
      symbol,
      interval as string || '1h',
      limit ? parseInt(limit as string) : 100
    );
    res.json({ success: true, data: klines, source: 'Binance' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/binance/top
 * Get top trading pairs from Binance
 */
router.get('/binance/top', async (req, res) => {
  try {
    const { limit } = req.query;
    const topPairs = await binanceService.getTopPairs(limit ? parseInt(limit as string) : 20);
    res.json({ success: true, data: topPairs, source: 'Binance' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/search
 * Search for coins
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }
    const results = await coinGeckoService.searchCoins(q as string);
    res.json({ success: true, data: results, source: 'CoinGecko' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
