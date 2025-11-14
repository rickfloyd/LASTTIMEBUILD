import { DeviceInfo } from '../services/authService';

// Local storage keys
export const ACCESS_TOKEN_KEY = 'quantum_access_token';
export const REFRESH_TOKEN_KEY = 'quantum_refresh_token';
export const USER_DATA_KEY = 'quantum_user_data';

// Get device information
export const getDeviceInfo = (): DeviceInfo => {
  return {
    type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
    browser: navigator.userAgent.split(' ').find(item => item.includes('Chrome') || item.includes('Firefox') || item.includes('Safari')) || 'unknown',
    os: navigator.platform || 'unknown'
  };
};

// Get access token for API calls
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Add authorization header to API requests
export const addAuthHeader = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};
