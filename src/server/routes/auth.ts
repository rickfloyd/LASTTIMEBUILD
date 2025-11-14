import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import AuthService, { LoginCredentials, RegisterData, DeviceInfo } from '../../services/authService';
import { authMiddleware } from '../middleware/auth';
import { User } from '../../database/models';

const router = Router();
const authService = AuthService.getInstance();

// Get device info from request
const getDeviceInfo = (req: Request): DeviceInfo => {
  return {
    type: req.headers['sec-ch-ua-mobile'] === '?1' ? 'mobile' : 'desktop',
    browser: req.headers['user-agent']?.split(' ').find(item => 
      item.includes('Chrome') || item.includes('Firefox') || item.includes('Safari')
    ) || 'unknown',
    os: req.headers['sec-ch-ua-platform']?.replace(/"/g, '') || 'unknown',
    ip: req.ip || req.connection.remoteAddress || 'unknown'
  };
};

// Validation middleware
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 6 characters with uppercase, lowercase, and number'),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .trim(),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .trim()
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Check validation results
const checkValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// POST /api/auth/register
router.post('/register', registerValidation, checkValidation, async (req: Request, res: Response) => {
  try {
    const userData: RegisterData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    const deviceInfo = getDeviceInfo(req);
    const result = await authService.register(userData, deviceInfo);

    res.status(201).json({
      message: 'Registration successful',
      user: result.user,
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

// POST /api/auth/login
router.post('/login', loginValidation, checkValidation, async (req: Request, res: Response) => {
  try {
    const credentials: LoginCredentials = {
      email: req.body.email,
      password: req.body.password
    };

    const deviceInfo = getDeviceInfo(req);
    const result = await authService.login(credentials, deviceInfo);

    res.json({
      message: 'Login successful',
      user: result.user,
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Login failed'
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token is required'
      });
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      message: 'Token refreshed successfully',
      accessToken: result.accessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Token refresh failed'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed'
    });
  }
});

// POST /api/auth/logout-all
router.post('/logout-all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    await authService.logoutAllDevices(userId);

    res.json({
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      error: 'Logout from all devices failed'
    });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
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
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user data'
    });
  }
});

// GET /api/auth/sessions
router.get('/sessions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const sessions = await authService.getUserSessions(userId);

    res.json({
      sessions: sessions.map(session => ({
        id: session._id,
        device: session.device,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        isActive: session.isActive
      }))
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      error: 'Failed to fetch sessions'
    });
  }
});

// DELETE /api/auth/sessions/:sessionId
router.delete('/sessions/:sessionId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { sessionId } = req.params;
    
    await authService.revokeSession(sessionId, userId);

    res.json({
      message: 'Session revoked successfully'
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      error: 'Failed to revoke session'
    });
  }
});

// POST /api/auth/change-password
router.post('/change-password', 
  authMiddleware,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must be at least 6 characters with uppercase, lowercase, and number')
  ],
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;
      
      await authService.changePassword(userId, currentPassword, newPassword);

      res.json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Password change failed'
      });
    }
  }
);

// POST /api/auth/forgot-password
router.post('/forgot-password', 
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await authService.requestPasswordReset(email);

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Password reset request failed'
      });
    }
  }
);

export default router;