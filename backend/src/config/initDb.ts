import { pool } from './db.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

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

    // 4. Seed or update Arun Kumar (Student)
    const arunCheck = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', ['arun.kumar@bitsathy.ac.in']);
    let arunId: string;
    if (arunCheck.rows.length === 0) {
      arunId = randomUUID();
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4, $5, true)`,
        [arunId, 'Arun Kumar', 'arun.kumar@bitsathy.ac.in', defaultHash, 'STUDENT']
      );
    } else {
      arunId = arunCheck.rows[0].id;
      // Update password hash so password123 works
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [defaultHash, arunId]);
    }

    const arunStudentCheck = await pool.query('SELECT id FROM students WHERE user_id = $1', [arunId]);
    if (arunStudentCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO students (id, user_id, name, email, department, register_number, phone, year, semester, section)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 3, 5, 'A')`,
        [randomUUID(), arunId, 'Arun Kumar', 'arun.kumar@bitsathy.ac.in', 'Computer Science', '21CS001', '+91 98765 43210']
      );
    }

    // 5. Seed or update Dr. Priya Sharma (Staff)
    const priyaCheck = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', ['priya.faculty@bitsathy.ac.in']);
    let priyaId: string;
    if (priyaCheck.rows.length === 0) {
      priyaId = randomUUID();
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4, $5, true)`,
        [priyaId, 'Dr. Priya Sharma', 'priya.faculty@bitsathy.ac.in', defaultHash, 'STAFF']
      );
    } else {
      priyaId = priyaCheck.rows[0].id;
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [defaultHash, priyaId]);
    }

    const priyaStaffCheck = await pool.query('SELECT id FROM staff WHERE user_id = $1', [priyaId]);
    if (priyaStaffCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO staff (id, user_id, name, email, department, designation, employee_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [randomUUID(), priyaId, 'Dr. Priya Sharma', 'priya.faculty@bitsathy.ac.in', 'Computer Science & Engineering', 'Associate Professor & Class Advisor', 'STF-CS-042']
      );
    }

    console.log('✅ PostgreSQL tables and test accounts synchronized successfully.');
  } catch (err: any) {
    console.warn('⚠️ PostgreSQL initialization notice:', err.message || err);
  }
};
