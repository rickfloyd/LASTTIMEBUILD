import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { User } from '../../database/models';

const router = Router();

// Validation middleware
const checkValidation = (_req: Request, res: Response, next: () => void) => {
  const errors = validationResult(_req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/users/profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile'
    });
  }
});

// PUT /api/users/profile
router.put('/profile', 
  authMiddleware,
  [
    body('profile.firstName').optional().isLength({ max: 50 }).trim(),
    body('profile.lastName').optional().isLength({ max: 50 }).trim(),
    body('profile.bio').optional().isLength({ max: 500 }).trim(),
    body('profile.location').optional().isLength({ max: 100 }).trim(),
    body('profile.website').optional().isURL().withMessage('Invalid website URL'),
    body('profile.phone').optional().isMobilePhone('any').withMessage('Invalid phone number')
  ],
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { profile, preferences } = req.body;
      
      const updateData: Record<string, unknown> = {};
      
      if (profile) {
        Object.keys(profile).forEach(key => {
          if (profile[key] !== undefined) {
            updateData[`profile.${key}`] = profile[key];
          }
        });
      }
      
      if (preferences) {
        Object.keys(preferences).forEach(key => {
          if (preferences[key] !== undefined) {
            updateData[`preferences.${key}`] = preferences[key];
          }
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({
        message: 'Profile updated successfully',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Failed to update profile'
      });
    }
  }
);

// GET /api/users/stats
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await User.findById(userId).select('gaming trading mining activity');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      gaming: user.gaming,
      trading: user.trading,
      mining: user.mining,
      activity: {
        loginCount: user.activity.loginCount,
        lastLogin: user.activity.lastLogin,
        lastActive: user.activity.lastActive
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch user stats'
    });
  }
});

// PUT /api/users/preferences
router.put('/preferences',
  authMiddleware,
  [
    body('theme').optional().isIn(['dark', 'light', 'cyber']).withMessage('Invalid theme'),
    body('notifications.email').optional().isBoolean(),
    body('notifications.push').optional().isBoolean(),
    body('notifications.trading').optional().isBoolean(),
    body('notifications.mining').optional().isBoolean(),
    body('privacy.showProfile').optional().isBoolean(),
    body('privacy.showTrades').optional().isBoolean(),
    body('privacy.showMining').optional().isBoolean()
  ],
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const preferences = req.body;
      
      const updateData: Record<string, unknown> = {};
      
      Object.keys(preferences).forEach(key => {
        if (preferences[key] !== undefined) {
          updateData[`preferences.${key}`] = preferences[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('preferences');

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({
        message: 'Preferences updated successfully',
        preferences: user.preferences
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({
        error: 'Failed to update preferences'
      });
    }
  }
);

// GET /api/users/public/:username
router.get('/public/:username', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('username profile gaming trading mining createdAt');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check privacy settings
    if (!user.preferences?.privacy?.showProfile) {
      return res.status(403).json({
        error: 'Profile is private'
      });
    }

    res.json({
      username: user.username,
      profile: user.profile,
      gaming: user.gaming,
      trading: user.preferences?.privacy?.showTrades ? user.trading : null,
      mining: user.preferences?.privacy?.showMining ? user.mining : null,
      memberSince: user.createdAt
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch public profile'
    });
  }
});

// GET /api/users/leaderboard
router.get('/leaderboard', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { type = 'gaming', limit = 10 } = req.query;
    
    let sortField = 'gaming.level';
    if (type === 'trading') sortField = 'trading.portfolioValue';
    if (type === 'mining') sortField = 'mining.totalEarnings';
    
    const users = await User.find({ 
      status: 'active',
      'preferences.privacy.showProfile': true 
    })
    .select('username profile gaming trading mining')
    .sort({ [sortField]: -1 })
    .limit(parseInt(limit as string));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      avatar: user.profile?.avatar,
      gaming: user.gaming,
      trading: user.preferences?.privacy?.showTrades ? user.trading : null,
      mining: user.preferences?.privacy?.showMining ? user.mining : null
    }));

    res.json({
      type,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch leaderboard'
    });
  }
});

// POST /api/users/gaming/level-up
router.post('/gaming/level-up', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { experience } = req.body;
    
    if (!experience || experience < 0) {
      return res.status(400).json({
        error: 'Valid experience points required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Simple level calculation
    const newExperience = user.gaming.experience + experience;
    const newLevel = Math.floor(newExperience / 1000) + 1;

    await User.findByIdAndUpdate(userId, {
      $set: {
        'gaming.experience': newExperience,
        'gaming.level': Math.max(newLevel, user.gaming.level)
      }
    });

    res.json({
      message: 'Experience updated successfully',
      gaming: {
        level: Math.max(newLevel, user.gaming.level),
        experience: newExperience
      }
    });
  } catch (error) {
    console.error('Level up error:', error);
    res.status(500).json({
      error: 'Failed to update gaming stats'
    });
  }
});

export default router;