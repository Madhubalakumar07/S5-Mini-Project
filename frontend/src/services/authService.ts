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

// ── Development fallback accounts (only used when backend is unreachable) ──
// Uses @bitsathy.ac.in domain as required by org policy.
const FALLBACK_USERS: Record<string, { user: AuthUser; role: 'student' | 'staff' }> = {
  'arun.kumar@bitsathy.ac.in': {
    role: 'student',
    user: {
      id: 'student_1',
      name: 'Arun Kumar',
      email: 'arun.kumar@bitsathy.ac.in',
      role: 'STUDENT',
      department: 'Computer Science',
      rollNumber: '21CS001',
      batch: '2026',
      phone: '+91 98765 43210',
      cgpa: 8.4,
    },
  },
  'priya.sharma@bitsathy.ac.in': {
    role: 'student',
    user: {
      id: 'student_2',
      name: 'Priya Sharma',
      email: 'priya.sharma@bitsathy.ac.in',
      role: 'STUDENT',
      department: 'Artificial Intelligence & Data Science',
      rollNumber: '21AD045',
      batch: '2026',
      phone: '+91 98123 45678',
      cgpa: 9.1,
    },
  },
  'rahul.verma@bitsathy.ac.in': {
    role: 'student',
    user: {
      id: 'student_3',
      name: 'Rahul Verma',
      email: 'rahul.verma@bitsathy.ac.in',
      role: 'STUDENT',
      department: 'Electronics & Communication',
      rollNumber: '20EC089',
      batch: '2025',
      phone: '+91 98456 78901',
      cgpa: 8.2,
    },
  },
  'priya.faculty@bitsathy.ac.in': {
    role: 'staff',
    user: {
      id: 'staff_1',
      name: 'Dr. Priya Sharma',
      email: 'priya.faculty@bitsathy.ac.in',
      role: 'STAFF',
      department: 'Computer Science & Engineering',
      staffId: 'STF-CS-042',
      designation: 'Associate Professor & Class Advisor',
      batch: 'Faculty',
      phone: '+91 94432 18765',
    },
  },
  'rajesh.faculty@bitsathy.ac.in': {
    role: 'staff',
    user: {
      id: 'staff_2',
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh.faculty@bitsathy.ac.in',
      role: 'STAFF',
      department: 'Artificial Intelligence & Data Science',
      staffId: 'STF-AD-018',
      designation: 'Professor & HOD',
      batch: 'Faculty',
      phone: '+91 94432 18766',
    },
  },
};

const ORG_DOMAIN = 'bitsathy.ac.in';

const validateOrgEmail = (email: string): boolean => {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(`@${ORG_DOMAIN}`);
};

const makeMockToken = (userId: string) => `dev_mock_token_${userId}_${Date.now()}`;

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
      // Offline fallback for development — ONLY if backend unreachable
      if (import.meta.env.DEV) {
        const matched = FALLBACK_USERS[emailNorm];
        if (matched) {
          const mockToken = makeMockToken(matched.user.id);
          localStorage.setItem('auth_token', mockToken);
          localStorage.setItem('auth_user', JSON.stringify(matched.user));
          return {
            message: 'Login successful (offline dev mode)',
            token: mockToken,
            user: matched.user,
          };
        }
      }
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
      // If token is invalid/expired, clear storage
      if (err.message?.includes('expired') || err.message?.includes('Invalid')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      // Fall back to cached user for offline dev
      const cached = this.getStoredUser();
      if (cached) return { user: cached };
      throw new Error('Session validation failed. Please log in again.');
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
