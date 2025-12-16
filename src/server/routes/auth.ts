import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import AuthService, { LoginCredentials, RegisterData, DeviceInfo } from '../../services/authService';
import { authMiddleware } from '../middleware/auth';
import { User } from '../../database/models';
import { trackLogin, jwtVersion, JWT_SECRET } from '../server'; // Import security features

const router = Router();
const authService = AuthService.getInstance();

const getDeviceInfo = (req: Request): DeviceInfo => ({
    type: req.headers['sec-ch-ua-mobile'] === '?1' ? 'mobile' : 'desktop',
    browser: req.headers['user-agent']?.split(' ').find(item => item.includes('Chrome') || item.includes('Firefox') || item.includes('Safari')) || 'unknown',
    os: req.headers['sec-ch-ua-platform']?.replace(/"/g, '') || 'unknown',
    ip: req.ip || 'unknown'
});

const registerValidation = [
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
];

const checkValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    next();
};

router.post('/register', registerValidation, checkValidation, async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body, getDeviceInfo(req));
        res.status(201).json({ message: 'Registration successful', ...result });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', loginValidation, checkValidation, async (req: Request, res: Response) => {
    const ip = req.ip || 'unknown';
    try {
        const result = await authService.login(req.body, getDeviceInfo(req));
        trackLogin(ip, true);

        // Issue a versioned token
        const token = jwt.sign(
            { 
                userId: result.user.id, 
                role: result.user.role,
                v: jwtVersion // Include token version
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Login successful', 
            user: result.user,
            accessToken: token, // Send the versioned token
            refreshToken: result.refreshToken
        });
    } catch (error: any) {
        trackLogin(ip, false);
        res.status(401).json({ error: error.message });
    }
});

router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        
        // Issue a new versioned access token
        const newAccessToken = jwt.sign(
            { 
                userId: result.userId,
                role: result.role,
                v: jwtVersion 
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ message: 'Token refreshed', accessToken: newAccessToken });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
    try {
        await authService.logout(req.body.refreshToken);
        res.json({ message: 'Logout successful' });
    } catch (error: any) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

router.post('/logout-all', authMiddleware, async (req: Request, res: Response) => {
    try {
        await authService.logoutAllDevices(req.user!.userId);
        res.json({ message: 'Logged out from all devices' });
    } catch (error: any) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user!.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// LOGIN BYPASS ROUTE
if (process.env.QUANTUM_BYPASS_KEY) {
    router.get('/bypass-login', (req: Request, res: Response) => {
        if (req.query.key !== process.env.QUANTUM_BYPASS_KEY) {
            return res.status(403).json({ error: 'Invalid bypass key.' });
        }

        const bypassUser = {
            id: 'bypass_user_01',
            role: 'admin',
            username: 'bypass_user',
        };

        const token = jwt.sign(
            {
                userId: bypassUser.id,
                role: bypassUser.role,
                v: jwtVersion,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Bypass successful. Logged in as bypass_user.',
            user: bypassUser,
            accessToken: token,
        });
    });
}

export default router;
