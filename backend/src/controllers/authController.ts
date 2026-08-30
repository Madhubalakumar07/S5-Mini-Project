import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware.js';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  department?: string;
  rollNumber?: string;
  batch?: string;
  phone?: string;
  cgpa?: number;
}

// Pre-seeded demo users (Password for all demo users is: password123)
const defaultHash = bcrypt.hashSync('password123', 10);

const users: User[] = [
  {
    id: 'user_1',
    name: 'Arun Kumar',
    email: 'arun.kumar@college.edu',
    passwordHash: defaultHash,
    role: 'student',
    department: 'Computer Science',
    rollNumber: '21CS001',
    batch: '2026',
    phone: '+91 98765 43210',
    cgpa: 8.4,
  },
  {
    id: 'user_2',
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    passwordHash: defaultHash,
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    rollNumber: '21AD045',
    batch: '2026',
    phone: '+91 98123 45678',
    cgpa: 9.1,
  },
  {
    id: 'user_3',
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
    passwordHash: defaultHash,
    role: 'student',
    department: 'Electronics & Communication',
    rollNumber: '20EC089',
    batch: '2025',
    phone: '+91 98456 78901',
    cgpa: 8.2,
  },
];

const generateToken = (user: User) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
      batch: user.batch,
      phone: user.phone,
      cgpa: user.cgpa,
    },
    secret,
    { expiresIn: '7d' }
  );
};

const sanitizeUser = (user: User) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department, rollNumber, batch, phone, cgpa } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role || 'student',
      department: department || 'Computer Science',
      rollNumber: rollNumber || `21CS${Math.floor(100 + Math.random() * 900)}`,
      batch: batch || '2026',
      phone: phone || '+91 98765 00000',
      cgpa: cgpa ? Number(cgpa) : 8.5,
    };

    users.push(newUser);

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = users.find((u) => u.id === req.user?.id || u.email.toLowerCase() === req.user?.email.toLowerCase());
    if (!user) {
      return res.json({ user: req.user });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
};
