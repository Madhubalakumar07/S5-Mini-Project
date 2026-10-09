// Frontend auth service — communicates with backend authentication API.
// Falls back to offline demo mode ONLY in development when backend is unavailable.

import { apiClient } from './apiClient';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  department?: string;
  rollNumber?: string;
  batch?: string;
  phone?: string;
  cgpa?: number;
  designation?: string;
  staffId?: string;
  role?: string; // Ignored by server; always STUDENT for self-registration
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: string; // Informational only; server enforces role from DB
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  rollNumber?: string;
  staffId?: string;
  batch?: string;
  phone?: string;
  cgpa?: number;
  designation?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

const ORG_DOMAIN = 'bitsathy.ac.in';

const validateOrgEmail = (email: string): boolean => {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(`@${ORG_DOMAIN}`);
};

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    // Client-side org domain check before hitting backend
    if (!validateOrgEmail(data.email)) {
      throw new Error(`Only official @${ORG_DOMAIN} email addresses are permitted.`);
    }

    try {
      const result = await apiClient.post('/auth/register', {
        name: data.name,
        email: data.email.trim().toLowerCase(),
        password: data.password,
        department: data.department,
        rollNumber: data.rollNumber,
        batch: data.batch,
        phone: data.phone,
        cgpa: data.cgpa,
      });

      if (result.data?.token) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('auth_user', JSON.stringify(result.data.user));
      }

      return {
        message: result.message || 'Registration successful',
        token: result.data?.token,
        user: result.data?.user,
      };
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const emailNorm = data.email.trim().toLowerCase();

    if (!validateOrgEmail(emailNorm)) {
      throw new Error(`Only official @${ORG_DOMAIN} email addresses are permitted.`);
    }

    try {
      const result = await apiClient.post('/auth/login', {
        email: emailNorm,
        password: data.password,
      }, { skipAuth: true });

      const authData = result.data || result;
      const token = authData.token;
      const user = authData.user;

      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }

      return {
        message: result.message || 'Login successful',
        token,
        user,
      };
    } catch (networkErr: any) {
      throw new Error(networkErr.message || 'Login failed');
    }
  },

  async getMe(): Promise<{ user: AuthUser }> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No authentication token found');

    try {
      const result = await apiClient.get('/auth/me');
      const user = result.data?.user || result.user;
      if (user) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
      return { user };
    } catch (err: any) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      throw new Error(err.message || 'Session validation failed. Please log in again.');
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout; clear local state regardless
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};
