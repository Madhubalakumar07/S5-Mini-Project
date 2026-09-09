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
  if (!user || user.role === 'staff') return defaultStudent;
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

const buildStaffFromUser = (user: AuthUser | null): StaffProfile => {
  if (!user || user.role !== 'staff') return defaultStaffProfile;
  return {
    id: user.id || 'STF_001',
    name: user.name || 'Dr. Faculty Member',
    staffId: user.staffId || user.rollNumber || 'STF-CS-042',
    email: user.email,
    department: user.department || 'Computer Science & Engineering',
    designation: user.designation || 'Associate Professor & Class Advisor',
    phone: user.phone || '+91 94432 18765',
    office: 'Academic Block B, Room 304',
    avatarInitials: getInitials(user.name || 'Faculty Member'),
    subjects: [
      'Data Structures & Algorithms (CS301)',
      'Database Management Systems (CS302)',
      'Artificial Intelligence & ML (CS501)',
    ],
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Computed student and staff objects synced with user
  const [student, setStudent] = useState<Student>(() => buildStudentFromUser(authService.getStoredUser()));
  const [staffProfile, setStaffProfile] = useState<StaffProfile>(() => buildStaffFromUser(authService.getStoredUser()));

  const role: 'student' | 'staff' = user?.role === 'staff' ? 'staff' : 'student';
  const isStaff = role === 'staff';
  const isStudent = role === 'student';

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
      } catch (err) {
        console.warn('Backend validation failed, using cached session:', err);
        const cachedUser = authService.getStoredUser();
        if (cachedUser) {
          setUser(cachedUser);
          setStudent(buildStudentFromUser(cachedUser));
          setStaffProfile(buildStaffFromUser(cachedUser));
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

  const logout = () => {
    authService.logout();
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
