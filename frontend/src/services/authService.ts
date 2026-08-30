// Frontend API client for Backend Authentication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  rollNumber?: string;
  batch?: string;
  phone?: string;
  cgpa?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  rollNumber?: string;
  batch?: string;
  phone?: string;
  cgpa?: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export const authService = {
  // Register a new user
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
    }

    return result;
  },

  // Login user
  async login(data: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
    }

    return result;
  },

  // Fetch current authenticated user
  async getMe(): Promise<{ user: AuthUser }> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch user session');
    }

    if (result.user) {
      localStorage.setItem('auth_user', JSON.stringify(result.user));
    }

    return result;
  },

  // Logout
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  // Check token existence
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Get locally stored user
  getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};
