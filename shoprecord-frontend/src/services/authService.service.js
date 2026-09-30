import { api } from './api.service';
import { ENDPOINTS, STORAGE_KEYS } from '../utils/constants.utils';

// Login user
export const login = async (email, password) => {
  const data = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  
  if (data.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    }
  }
  
  return data;
};

// Register user
export const register = async (userData) => {
  const data = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
  
  if (data.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    }
  }
  
  return data;
};

// Logout user
export const logout = async () => {
  try {
    await api.post(ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const data = await api.get(ENDPOINTS.AUTH.ME);
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    }
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  return false;
};

// Get stored user data
export const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getStoredUser,
};

export default authService;
