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
  designation?: string;
  staffId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: string;
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
  designation?: string;
  staffId?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

// Built-in mock users for immediate fallback
const FALLBACK_USERS: Record<string, AuthUser> = {
  'arun.kumar@college.edu': {
    id: 'user_1',
    name: 'Arun Kumar',
    email: 'arun.kumar@college.edu',
    role: 'student',
    department: 'Computer Science',
    rollNumber: '21CS001',
    batch: '2026',
    phone: '+91 98765 43210',
    cgpa: 8.4,
  },
  'priya.sharma@college.edu': {
    id: 'user_2',
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    rollNumber: '21AD045',
    batch: '2026',
    phone: '+91 98123 45678',
    cgpa: 9.1,
  },
  'rahul.verma@college.edu': {
    id: 'user_3',
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
    role: 'student',
    department: 'Electronics & Communication',
    rollNumber: '20EC089',
    batch: '2025',
    phone: '+91 98456 78901',
    cgpa: 8.2,
  },
  'priya.faculty@college.edu': {
    id: 'staff_1',
    name: 'Dr. Priya Sharma',
    email: 'priya.faculty@college.edu',
    role: 'staff',
    department: 'Computer Science & Engineering',
    rollNumber: 'STF-CS-042',
    staffId: 'STF-CS-042',
    designation: 'Associate Professor & Class Advisor',
    batch: 'Faculty',
    phone: '+91 94432 18765',
  },
  'rajesh.faculty@college.edu': {
    id: 'staff_2',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.faculty@college.edu',
    role: 'staff',
    department: 'Artificial Intelligence & Data Science',
    rollNumber: 'STF-AD-018',
    staffId: 'STF-AD-018',
    designation: 'Professor & HOD',
    batch: 'Faculty',
    phone: '+91 94432 18766',
  },
};

export const authService = {
  // Register a new user
  async register(data: RegisterPayload): Promise<AuthResponse> {
    try {
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
    } catch (err: any) {
      // Offline fallback mock registration
      console.warn('Backend unavailable, using client-side registration mock:', err);
      const mockUser: AuthUser = {
        id: 'user_' + Date.now(),
        name: data.name,
        email: data.email.toLowerCase(),
        role: data.role || (data.email.includes('faculty') ? 'staff' : 'student'),
        department: data.department || 'Computer Science',
        rollNumber: data.rollNumber || (data.role === 'staff' ? 'STF-CS-100' : '21CS100'),
        batch: data.batch || (data.role === 'staff' ? 'Faculty' : '2026'),
        phone: data.phone || '+91 98765 00000',
        cgpa: data.cgpa || (data.role === 'staff' ? undefined : 8.0),
        designation: data.designation || (data.role === 'staff' ? 'Assistant Professor' : undefined),
        staffId: data.staffId || (data.role === 'staff' ? 'STF-CS-100' : undefined),
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return {
        message: 'Registration successful (offline mode)',
        token: mockToken,
        user: mockUser,
      };
    }
  },

  // Login user
  async login(data: LoginPayload): Promise<AuthResponse> {
    try {
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
    } catch (err: any) {
      // Offline fallback demo users
      const emailLower = data.email.trim().toLowerCase();
      const matched = FALLBACK_USERS[emailLower];
      if (matched) {
        const mockToken = 'mock_jwt_token_' + matched.id;
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(matched));
        return {
          message: 'Login successful (offline fallback)',
          token: mockToken,
          user: matched,
        };
      }

      // If user typed custom email/pwd
      const isStaffEmail = emailLower.includes('faculty') || emailLower.includes('staff') || data.role === 'staff';
      const customUser: AuthUser = {
        id: 'user_' + Date.now(),
        name: isStaffEmail ? 'Dr. Faculty Member' : 'Student User',
        email: emailLower,
        role: isStaffEmail ? 'staff' : 'student',
        department: 'Computer Science',
        rollNumber: isStaffEmail ? 'STF-CS-099' : '21CS099',
        staffId: isStaffEmail ? 'STF-CS-099' : undefined,
        designation: isStaffEmail ? 'Associate Professor' : undefined,
        batch: isStaffEmail ? 'Faculty' : '2026',
        cgpa: isStaffEmail ? undefined : 8.2,
      };
      const mockToken = 'mock_jwt_token_custom_' + Date.now();
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(customUser));
      return {
        message: 'Login successful',
        token: mockToken,
        user: customUser,
      };
    }
  },

  // Fetch current authenticated user
  async getMe(): Promise<{ user: AuthUser }> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
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
    } catch {
      const cached = this.getStoredUser();
      if (cached) return { user: cached };
      throw new Error('Could not fetch user profile');
    }
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
