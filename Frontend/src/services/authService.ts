import { api } from './api';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  userType: "consumer" | "farmer" | "admin";
  profileImage?: string;
}

// Registration data interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: "consumer" | "farmer";
}

// Token storage key
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Get token from local storage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Save token to local storage
const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Save user data to local storage
const saveUser = (user: User): void => {
  console.log('Saving user to localStorage:', user);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear auth data from local storage
const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Auth service with real API integration
export const authService = {
  // Login user
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success && response.token && response.user) {
        // Save token and user data
        saveToken(response.token);
        
        // Transform backend user to frontend User format
        const user: User = {
          id: response.user.id || response.user._id,
          name: response.user.name,
          email: response.user.email,
          userType: response.user.userType,
          profileImage: response.user.profileImage || ''
        };
        
        saveUser(user);
        return user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Register new user
  register: async (userData: RegisterData): Promise<User> => {
    try {
      console.log('Sending registration data:', userData);
      const response = await api.post('/auth/register', userData);
      
      console.log('Registration response:', response);
      
      if (response.success && response.token && response.user) {
        // Save token and user data
        saveToken(response.token);
        
        // Transform backend user to frontend User format
        const user: User = {
          id: response.user.id || response.user._id,
          name: response.user.name,
          email: response.user.email,
          userType: response.user.userType,
          profileImage: response.user.profileImage || ''
        };
        
        console.log('Transformed user object:', user);
        
        saveUser(user);
        return user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    // Clear auth data from local storage
    clearAuthData();
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Check for token first
      const token = getToken();
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }
      
      // Try to get user data from localStorage first
      const userString = localStorage.getItem(USER_KEY);
      console.log('User data from localStorage:', userString);
      
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          console.log('Parsed user data:', userData);
          return userData;
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // If not in localStorage, fetch from API
      console.log('Fetching user data from API');
      const response = await api.get('/auth/me', true);
      console.log('API response for user data:', response);
      
      if (response.success && response.data) {
        // Transform backend user to frontend User format
        const user: User = {
          id: response.data.id || response.data._id,
          name: response.data.name,
          email: response.data.email,
          userType: response.data.userType,
          profileImage: response.data.profileImage || ''
        };
        
        console.log('Transformed user from API:', user);
        saveUser(user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Reset password
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  }
};
