import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser, LoginPayload, RegisterPayload } from '../services/authService';
import type { Student } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  student: Student;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateStudentProfile: (data: Partial<Student>) => void;
}

const defaultStudent: Student = {
  id: '21CS001',
  name: 'Arun Kumar',
  firstName: 'Arun',
  department: 'Computer Science',
  batch: '2026',
  rollNumber: '21CS001',
  cgpa: 8.4,
  semesterGpa: 8.7,
  email: 'arun.kumar@college.edu',
  phone: '+91 98765 43210',
  avatarInitials: 'AK',
  onlineStatus: 'online',
};

const getInitials = (name: string): string => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const buildStudentFromUser = (user: AuthUser | null): Student => {
  if (!user) return defaultStudent;
  const name = user.name || 'Student';
  const firstName = name.split(' ')[0];
  const initials = getInitials(name);

  return {
    id: user.id || user.rollNumber || 'STU001',
    name,
    firstName,
    department: user.department || 'Computer Science',
    batch: user.batch || '2026',
    rollNumber: user.rollNumber || '21CS001',
    cgpa: user.cgpa ?? 8.4,
    semesterGpa: 8.7,
    email: user.email,
    phone: user.phone || '+91 98765 43210',
    avatarInitials: initials,
    onlineStatus: 'online',
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Computed student object synced with user
  const [student, setStudent] = useState<Student>(() => buildStudentFromUser(authService.getStoredUser()));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response?.user) {
          setUser(response.user);
          setStudent(buildStudentFromUser(response.user));
        }
      } catch (err) {
        console.warn('Backend validation failed, using cached session:', err);
        const cachedUser = authService.getStoredUser();
        if (cachedUser) {
          setUser(cachedUser);
          setStudent(buildStudentFromUser(cachedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      setUser(response.user);
      setToken(response.token);
      setStudent(buildStudentFromUser(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      setUser(response.user);
      setToken(response.token);
      setStudent(buildStudentFromUser(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setStudent(defaultStudent);
  };

  const updateStudentProfile = (data: Partial<Student>) => {
    setStudent((prev) => {
      const updated = { ...prev, ...data };
      if (data.name) {
        updated.firstName = data.name.split(' ')[0];
        updated.avatarInitials = getInitials(data.name);
      }
      return updated;
    });

    if (user) {
      const updatedUser: AuthUser = {
        ...user,
        name: data.name ?? user.name,
        email: data.email ?? user.email,
        department: data.department ?? user.department,
        rollNumber: data.rollNumber ?? user.rollNumber,
        batch: data.batch ?? user.batch,
        phone: data.phone ?? user.phone,
        cgpa: data.cgpa ?? user.cgpa,
      };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
