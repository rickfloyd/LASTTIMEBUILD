import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/gaming/profile
router.get('/profile', authMiddleware, async (_req: Request, res: Response) => {
  try {
    res.json({
      message: 'Gaming profile endpoint - Coming soon!',
      profile: {
        level: 1,
        experience: 0,
        achievements: []
      }
    });
  } catch (error) {
    console.error('Gaming profile error:', error);
    res.status(500).json({ error: 'Failed to fetch gaming profile' });
  }
});

export default router;