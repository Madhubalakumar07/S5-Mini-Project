import bcrypt from 'bcryptjs';
import { IUserRepository } from './IUserRepository.js';
import { User, SafeUser } from '../types/index.js';

// Pre-compute bcrypt hash for default test password: password123
const DEFAULT_TEST_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

/**
 * In-Memory User Repository for development.
 * Contains initial seed accounts using official @bitsathy.ac.in domain.
 */
export class MockUserRepository implements IUserRepository {
  private users: User[] = [
    // ─── Students ────────────────────────────────────────────────────────
    {
      id: 'student_1',
      name: 'Arun Kumar',
      email: 'arun.kumar@bitsathy.ac.in',
      passwordHash: DEFAULT_TEST_PASSWORD_HASH,
      role: 'STUDENT',
      department: 'Computer Science',
      rollNumber: '21CS001',
      batch: '2026',
      phone: '+91 98765 43210',
      cgpa: 8.4,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'student_2',
      name: 'Priya Sharma',
      email: 'priya.sharma@bitsathy.ac.in',
      passwordHash: DEFAULT_TEST_PASSWORD_HASH,
      role: 'STUDENT',
      department: 'Artificial Intelligence & Data Science',
      rollNumber: '21AD045',
      batch: '2026',
      phone: '+91 98123 45678',
      cgpa: 9.1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'student_3',
      name: 'Rahul Verma',
      email: 'rahul.verma@bitsathy.ac.in',
      passwordHash: DEFAULT_TEST_PASSWORD_HASH,
      role: 'STUDENT',
      department: 'Electronics & Communication',
      rollNumber: '20EC089',
      batch: '2025',
      phone: '+91 98456 78901',
      cgpa: 8.2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },

    // ─── Staff / Faculty ─────────────────────────────────────────────────
    {
      id: 'staff_1',
      name: 'Dr. Priya Sharma',
      email: 'priya.faculty@bitsathy.ac.in',
      passwordHash: DEFAULT_TEST_PASSWORD_HASH,
      role: 'STAFF',
      department: 'Computer Science & Engineering',
      staffId: 'STF-CS-042',
      designation: 'Associate Professor & Class Advisor',
      batch: 'Faculty',
      phone: '+91 94432 18765',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'staff_2',
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh.faculty@bitsathy.ac.in',
      passwordHash: DEFAULT_TEST_PASSWORD_HASH,
      role: 'STAFF',
      department: 'Artificial Intelligence & Data Science',
      staffId: 'STF-AD-018',
      designation: 'Professor & HOD',
      batch: 'Faculty',
      phone: '+91 94432 18766',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === normalized);
    return user ? { ...user } : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const existing = this.users[idx];
    const updated: User = {
      ...existing,
      ...updateData,
      id: existing.id, // Prevent mutating ID
      updatedAt: new Date().toISOString(),
    };
    this.users[idx] = updated;
    return { ...updated };
  }

  sanitizeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = user;
    return safe;
  }
}

export const userRepository = new MockUserRepository();
