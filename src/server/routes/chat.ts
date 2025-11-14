import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/chat/rooms
router.get('/rooms', authMiddleware, async (_req: Request, res: Response) => {
  try {
    res.json({
      message: 'Chat rooms endpoint - Coming soon!',
      rooms: []
    });
  } catch (error) {
    console.error('Chat rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

// GET /api/chat/messages/:roomId
router.get('/messages/:roomId', authMiddleware, async (_req: Request, res: Response) => {
  try {
    res.json({
      message: 'Chat messages endpoint - Coming soon!',
      messages: []
    });
  } catch (error) {
    console.error('Chat messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;