import { pool } from './db.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

interface DemoStudent {
  name: string;
  email: string;
  department: string;
  registerNumber: string;
  year: number;
  semester: number;
  section: string;
  phone: string;
}

interface DemoStaff {
  name: string;
  email: string;
  department: string;
  designation: string;
  employeeId: string;
  phone: string;
}

const DEMO_STUDENTS: DemoStudent[] = [
  {
    name: 'Arun Kumar',
    email: 'arun.kumar@bitsathy.ac.in',
    department: 'Computer Science',
    registerNumber: '21CS001',
    year: 3,
    semester: 5,
    section: 'A',
    phone: '+91 98765 43210',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science',
    registerNumber: '21AD045',
    year: 3,
    semester: 5,
    section: 'A',
    phone: '+91 98123 45678',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@bitsathy.ac.in',
    department: 'Electronics & Communication',
    registerNumber: '20EC089',
    year: 4,
    semester: 7,
    section: 'B',
    phone: '+91 98456 78901',
  },
  {
    name: 'Bala Murugan',
    email: 'bala.m@bitsathy.ac.in',
    department: 'Computer Science',
    registerNumber: '21CS002',
    year: 3,
    semester: 5,
    section: 'B',
    phone: '+91 98765 11111',
  },
];

const DEMO_STAFF: DemoStaff[] = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.faculty@bitsathy.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & Class Advisor',
    employeeId: 'STF-CS-042',
    phone: '+91 94432 18765',
  },
  {
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.faculty@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Professor & HOD',
    employeeId: 'STF-AD-018',
    phone: '+91 94432 18766',
  },
  {
    name: 'Staff User',
    email: 'staff@bitsathy.ac.in',
    department: 'Computer Science',
    designation: 'Professor',
    employeeId: 'EMP001',
    phone: '+91 94432 00000',
  },
];

export const initDb = async () => {
  try {
    // 1. Ensure users table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ensure students table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        department VARCHAR(255),
        register_number VARCHAR(100),
        year INTEGER DEFAULT 3,
        semester INTEGER DEFAULT 5,
        section VARCHAR(10),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Ensure staff table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        designation VARCHAR(255),
        employee_id VARCHAR(100),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const defaultHash = await bcrypt.hash('password123', 10);

    // 4. Seed / Synchronize all Students
    for (const student of DEMO_STUDENTS) {
      const emailLower = student.email.toLowerCase();
      const userRes = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [emailLower]);
      let userId: string;

      if (userRes.rows.length === 0) {
        userId = randomUUID();
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, role, is_active)
           VALUES ($1, $2, $3, $4, $5, true)`,
          [userId, student.name, emailLower, defaultHash, 'STUDENT']
        );
      } else {
        userId = userRes.rows[0].id;
        await pool.query(
          'UPDATE users SET name = $1, password_hash = $2, role = $3, is_active = true WHERE id = $4',
          [student.name, defaultHash, 'STUDENT', userId]
        );
      }

      const studRes = await pool.query('SELECT id FROM students WHERE user_id = $1', [userId]);
      if (studRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO students (id, user_id, name, email, department, register_number, phone, year, semester, section)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            randomUUID(),
            userId,
            student.name,
            emailLower,
            student.department,
            student.registerNumber,
            student.phone,
            student.year,
            student.semester,
            student.section,
          ]
        );
      } else {
        await pool.query(
          `UPDATE students SET
             name = $1,
             email = $2,
             department = $3,
             register_number = $4,
             phone = $5,
             year = $6,
             semester = $7,
             section = $8
           WHERE user_id = $9`,
          [
            student.name,
            emailLower,
            student.department,
            student.registerNumber,
            student.phone,
            student.year,
            student.semester,
            student.section,
            userId,
          ]
        );
      }
    }

    // 5. Seed / Synchronize all Staff
    for (const staffMember of DEMO_STAFF) {
      const emailLower = staffMember.email.toLowerCase();
      const userRes = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [emailLower]);
      let userId: string;

      if (userRes.rows.length === 0) {
        userId = randomUUID();
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, role, is_active)
           VALUES ($1, $2, $3, $4, $5, true)`,
          [userId, staffMember.name, emailLower, defaultHash, 'STAFF']
        );
      } else {
        userId = userRes.rows[0].id;
        await pool.query(
          'UPDATE users SET name = $1, password_hash = $2, role = $3, is_active = true WHERE id = $4',
          [staffMember.name, defaultHash, 'STAFF', userId]
        );
      }

      const staffRes = await pool.query('SELECT id FROM staff WHERE user_id = $1', [userId]);
      if (staffRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO staff (id, user_id, name, email, department, designation, employee_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            randomUUID(),
            userId,
            staffMember.name,
            emailLower,
            staffMember.department,
            staffMember.designation,
            staffMember.employeeId,
          ]
        );
      } else {
        await pool.query(
          `UPDATE staff SET
             name = $1,
             email = $2,
             department = $3,
             designation = $4,
             employee_id = $5
           WHERE user_id = $6`,
          [
            staffMember.name,
            emailLower,
            staffMember.department,
            staffMember.designation,
            staffMember.employeeId,
            userId,
          ]
        );
      }
    }

    console.log('✅ PostgreSQL: All demo users successfully pushed and synchronized into database.');
  } catch (err: any) {
    console.warn('⚠️ PostgreSQL initialization notice:', err.message || err);
  }
};
