import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser, LoginPayload, RegisterPayload } from '../services/authService';
import type { Student, StaffProfile } from '../types';
import { defaultStaffProfile } from '../data/staffData';

interface AuthContextType {
  user: AuthUser | null;
  student: Student;
  staffProfile: StaffProfile;
  role: 'student' | 'staff';
  isStaff: boolean;
  isStudent: boolean;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateStudentProfile: (data: Partial<Student>) => void;
  updateStaffProfile: (data: Partial<StaffProfile>) => void;
}

const defaultStudent: Student = {
  id: '',
  name: '',
  firstName: '',
  department: '',
  batch: '',
  rollNumber: '',
  cgpa: 0,
  semesterGpa: 0,
  email: '',
  phone: '',
  avatarInitials: '',
  onlineStatus: 'offline',
};

const getInitials = (name: string): string => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

/**
 * Normalizes role from server (STUDENT/STAFF) to frontend lowercase convention (student/staff).
 */
const normalizeRole = (role?: string): 'student' | 'staff' => {
  if (!role) return 'student';
  const r = role.toLowerCase();
  return r === 'staff' ? 'staff' : 'student';
};

const buildStudentFromUser = (user: AuthUser | null): Student => {
  if (!user || normalizeRole(user.role) === 'staff') return defaultStudent;
  const name = user.name || 'Student';
  const firstName = name.split(' ')[0];
  const initials = getInitials(name);

  return {
    id: user.id || user.rollNumber || '',
    name,
    firstName,
    department: user.department || 'General',
    batch: user.batch || '',
    rollNumber: user.rollNumber || '',
    cgpa: user.cgpa ?? 0,
    semesterGpa: user.cgpa ?? 0,
    email: user.email,
    phone: user.phone || '',
    avatarInitials: initials,
    onlineStatus: 'online',
  };
};

const buildStaffFromUser = (user: AuthUser | null): StaffProfile => {
  if (!user || normalizeRole(user.role) !== 'staff') return defaultStaffProfile;
  return {
    id: user.id || '',
    name: user.name || 'Faculty Member',
    staffId: user.staffId || user.rollNumber || '',
    email: user.email,
    department: user.department || 'General',
    designation: user.designation || 'Faculty',
    phone: user.phone || '',
    office: 'Faculty Block',
    avatarInitials: getInitials(user.name || 'Faculty Member'),
    subjects: [
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Artificial Intelligence & ML',
    ],
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Derived state
  const [student, setStudent] = useState<Student>(() => buildStudentFromUser(authService.getStoredUser()));
  const [staffProfile, setStaffProfile] = useState<StaffProfile>(() => buildStaffFromUser(authService.getStoredUser()));

  const role: 'student' | 'staff' = normalizeRole(user?.role);
  const isStaff = role === 'staff';
  const isStudent = role === 'student';

  // Restore session on app load by calling GET /api/auth/me
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
          setStaffProfile(buildStaffFromUser(response.user));
        }
      } catch {
        // Backend unreachable or token invalid — fall back to cached user
        const cachedUser = authService.getStoredUser();
        if (cachedUser) {
          setUser(cachedUser);
          setStudent(buildStudentFromUser(cachedUser));
          setStaffProfile(buildStaffFromUser(cachedUser));
        } else {
          // Token exists but no cached user and backend failed — clear state
          setUser(null);
          setToken(null);
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
      setStaffProfile(buildStaffFromUser(response.user));
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
      setStaffProfile(buildStaffFromUser(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    }
    setUser(null);
    setToken(null);
    setStudent(defaultStudent);
    setStaffProfile(defaultStaffProfile);
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

  const updateStaffProfile = (data: Partial<StaffProfile>) => {
    setStaffProfile((prev) => {
      const updated = { ...prev, ...data };
      if (data.name) {
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
        rollNumber: data.staffId ?? user.rollNumber,
        staffId: data.staffId ?? user.staffId,
        designation: data.designation ?? user.designation,
        phone: data.phone ?? user.phone,
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
        staffProfile,
        role,
        isStaff,
        isStudent,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateStudentProfile,
        updateStaffProfile,
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
