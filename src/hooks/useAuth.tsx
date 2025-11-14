import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AuthService, { LoginCredentials, RegisterData, AuthTokens, DeviceInfo } from '../services/authService';
import { IUser } from '../database/types';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY, getDeviceInfo } from '../utils/auth';

// Auth context interface
interface AuthContextType {
  user: Omit<IUser, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials, deviceInfo?: DeviceInfo) => Promise<void>;
  register: (userData: RegisterData, deviceInfo?: DeviceInfo) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<IUser>) => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Omit<IUser, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = AuthService.getInstance();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const userData = localStorage.getItem(USER_DATA_KEY);

        if (accessToken && userData) {
          try {
            // Verify token
            await authService.verifyToken(accessToken);
            setUser(JSON.parse(userData));
          } catch {
            // Token expired, try to refresh
            if (refreshToken) {
              try {
                const response = await authService.refreshToken(refreshToken);
                localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
                setUser(JSON.parse(userData));
              } catch {
                // Refresh failed, clear storage
                clearAuthData();
              }
            } else {
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [authService]);

  // Clear authentication data
  const clearAuthData = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
  };

  // Store authentication data
  const storeAuthData = (tokens: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(tokens.user));
    setUser(tokens.user);
  };

  // Login function
  const login = async (credentials: LoginCredentials, deviceInfo?: DeviceInfo) => {
    try {
      setIsLoading(true);
      const finalDeviceInfo = deviceInfo || getDeviceInfo();
      const tokens = await authService.login(credentials, finalDeviceInfo);
      storeAuthData(tokens);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData, deviceInfo?: DeviceInfo) => {
    try {
      setIsLoading(true);
      const finalDeviceInfo = deviceInfo || getDeviceInfo();
      const tokens = await authService.register(userData, finalDeviceInfo);
      storeAuthData(tokens);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshTokenValue);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      throw error;
    }
  };

  // Update user data
  const updateUser = (userData: Partial<IUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
