import jwt from 'jsonwebtoken';
import { User, Session } from '../database/models';
import { IUser, ISession } from '../database/types';

// Device information interface
export interface DeviceInfo {
  type?: string;
  browser?: string;
  os?: string;
  ip?: string;
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'quantum-charts-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Omit<IUser, 'password'>;
}

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Generate JWT tokens
  private generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    return { accessToken, refreshToken };
  }

  // Register new user
  async register(userData: RegisterData, deviceInfo?: DeviceInfo): Promise<AuthTokens> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Create new user
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName
        },
        verification: {
          email: false,
          phone: false,
          age: false,
          kyc: false
        }
      });

      await user.save();

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Create session
      await this.createSession(user._id.toString(), tokens.refreshToken, deviceInfo);

      // Update login activity
      await this.updateLoginActivity(user._id.toString(), deviceInfo?.ip);

      return {
        ...tokens,
        user: user.toJSON() as Omit<IUser, 'password'>
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginCredentials, deviceInfo?: DeviceInfo): Promise<AuthTokens> {
    try {
      // Find user by email
      const user = await User.findOne({ email: credentials.email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is active
      if (user.status !== 'active') {
        throw new Error('Account is suspended or banned');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Create session
      await this.createSession(user._id.toString(), tokens.refreshToken, deviceInfo);

      // Update login activity
      await this.updateLoginActivity(user._id.toString(), deviceInfo?.ip);

      return {
        ...tokens,
        user: user.toJSON() as Omit<IUser, 'password'>
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = await this.verifyToken(refreshToken);
      
      // Check if session exists and is active
      const session = await Session.findOne({
        token: refreshToken,
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (!session) {
        throw new Error('Invalid or expired refresh token');
      }

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        throw new Error('User not found or inactive');
      }

      // Generate new access token
      const { accessToken } = this.generateTokens(user);

      return { accessToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(refreshToken: string): Promise<void> {
    try {
      await Session.findOneAndUpdate(
        { token: refreshToken },
        { isActive: false }
      );
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Logout from all devices
  async logoutAllDevices(userId: string): Promise<void> {
    try {
      await Session.updateMany(
        { userId, isActive: true },
        { isActive: false }
      );
    } catch (error) {
      console.error('Logout all devices error:', error);
      throw error;
    }
  }

  // Create session
  private async createSession(userId: string, token: string, deviceInfo?: DeviceInfo): Promise<ISession> {
    try {
      const session = new Session({
        userId,
        token,
        device: {
          type: deviceInfo?.type || 'unknown',
          browser: deviceInfo?.browser,
          os: deviceInfo?.os,
          ip: deviceInfo?.ip
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      await session.save();
      return session;
    } catch (error) {
      console.error('Session creation error:', error);
      throw error;
    }
  }

  // Update login activity
  private async updateLoginActivity(userId: string, ip?: string): Promise<void> {
    try {
      const updateData: {
        'activity.lastLogin': Date;
        'activity.lastActive': Date;
        $inc: { 'activity.loginCount': number };
        $addToSet?: { 'activity.ipAddresses': string };
      } = {
        'activity.lastLogin': new Date(),
        'activity.lastActive': new Date(),
        $inc: { 'activity.loginCount': 1 }
      };

      if (ip) {
        updateData.$addToSet = { 'activity.ipAddresses': ip };
      }

      await User.findByIdAndUpdate(userId, updateData);
    } catch (error) {
      console.error('Login activity update error:', error);
    }
  }

  // Get user sessions
  async getUserSessions(userId: string): Promise<ISession[]> {
    try {
      return await Session.find({
        userId,
        isActive: true,
        expiresAt: { $gt: new Date() }
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Get user sessions error:', error);
      throw error;
    }
  }

  // Revoke session
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    try {
      await Session.findOneAndUpdate(
        { _id: sessionId, userId },
        { isActive: false }
      );
    } catch (error) {
      console.error('Revoke session error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      // Logout from all devices except current
      await Session.updateMany(
        { userId, isActive: true },
        { isActive: false }
      );
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Reset password (requires email verification)
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists
        return;
      }

      // In a real app, you would send an email with a reset token
      // For now, we'll just log it
      console.log(`Password reset requested for: ${email}`);
      
      // TODO: Implement email service and reset token generation
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }
}

export default AuthService;