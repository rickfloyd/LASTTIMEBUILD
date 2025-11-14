import { Request, Response, NextFunction } from 'express';
import AuthService from '../../services/authService';

// Extend Request interface to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      email: string;
      username: string;
    };
  }
}

const authService = AuthService.getInstance();

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = await authService.verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username
      };
      
      next();
    } catch {
      res.status(401).json({
        error: 'Invalid or expired token'
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed'
    });
    return;
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = await authService.verifyToken(token);
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username
        };
      } catch (error) {
        // Don't fail, just continue without user
        console.log('Optional auth failed:', error);
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Role-based access control middleware  
export const requireRole = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required'
        });
        return;
      }

      // For now, we'll implement basic role checking
      // This can be extended when user roles are added to the database
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        error: 'Authorization failed'
      });
      return;
    }
  };
};

// Subscription level middleware
export const requireSubscription = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required'
        });
        return;
      }

      // TODO: Check user subscription level from database
      // For now, allow all authenticated users
      next();
    } catch (error) {
      console.error('Subscription middleware error:', error);
      res.status(500).json({
        error: 'Subscription check failed'
      });
      return;
    }
  };
};