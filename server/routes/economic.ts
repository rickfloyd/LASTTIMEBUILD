import express from 'express';
import fredService from '../services/fred';

const router = express.Router();

/**
 * GET /api/economic/fred/:seriesId
 * Get FRED economic data
 */
router.get('/fred/:seriesId', async (req, res) => {
  try {
    const { seriesId } = req.params;
    const data = await fredService.getSeries(seriesId);
    res.json({ success: true, data, source: 'FRED' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
