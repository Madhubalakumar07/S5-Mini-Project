import { randomUUID } from 'crypto';
import { IUserRepository } from './IUserRepository.js';
import { User, SafeUser } from '../types/index.js';
import { pool } from '../config/db.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BASE_QUERY = `
  SELECT 
    u.id,
    u.name,
    u.email,
    u.password_hash,
    u.role,
    u.is_active,
    u.created_at,
    u.updated_at,
    s.department AS student_department,
    s.register_number AS student_roll_number,
    s.phone AS student_phone,
    s.year AS student_year,
    s.cgpa AS student_cgpa,
    st.department AS staff_department,
    st.designation AS staff_designation,
    st.employee_id AS staff_id
  FROM users u
  LEFT JOIN students s ON s.user_id = u.id
  LEFT JOIN staff st ON st.user_id = u.id
`;

function mapRowToUser(row: any): User {
  const department = row.student_department || row.staff_department || 'General';
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role as 'STUDENT' | 'STAFF',
    department,
    rollNumber: row.student_roll_number || undefined,
    staffId: row.staff_id || undefined,
    designation: row.staff_designation || undefined,
    batch: row.student_year ? `20${23 + (4 - Number(row.student_year))}` : undefined,
    year: row.student_year ? Number(row.student_year) : undefined,
    phone: row.student_phone || undefined,
    cgpa: row.student_cgpa !== null && row.student_cgpa !== undefined ? Number(row.student_cgpa) : undefined,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : (row.created_at || new Date().toISOString()),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : (row.updated_at || new Date().toISOString()),
  };
}

export class PostgresUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const res = await pool.query(
      `${BASE_QUERY} WHERE LOWER(u.email) = LOWER($1) LIMIT 1`,
      [email.trim()]
    );
    if (res.rows.length === 0) return null;
    return mapRowToUser(res.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    if (!UUID_REGEX.test(id)) {
      // If queried with rollNumber / employeeId
      const altRes = await pool.query(
        `${BASE_QUERY} WHERE s.register_number = $1 OR st.employee_id = $1 LIMIT 1`,
        [id]
      );
      if (altRes.rows.length > 0) return mapRowToUser(altRes.rows[0]);
      return null;
    }

    const res = await pool.query(
      `${BASE_QUERY} WHERE u.id = $1 LIMIT 1`,
      [id]
    );
    if (res.rows.length === 0) return null;
    return mapRowToUser(res.rows[0]);
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const userId = randomUUID();

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
      [
        userId,
        userData.name,
        userData.email.toLowerCase(),
        userData.passwordHash,
        userData.role,
      ]
    );

    if (userData.role === 'STUDENT') {
      await pool.query(
        `INSERT INTO students (id, user_id, name, email, department, register_number, phone, year, semester, section, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 5, 'A', NOW(), NOW())`,
        [
          randomUUID(),
          userId,
          userData.name,
          userData.email.toLowerCase(),
          userData.department || 'Computer Science',
          userData.rollNumber || null,
          userData.phone || null,
          userData.year || 3,
        ]
      );
    } else if (userData.role === 'STAFF') {
      await pool.query(
        `INSERT INTO staff (id, user_id, name, email, department, designation, employee_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          randomUUID(),
          userId,
          userData.name,
          userData.email.toLowerCase(),
          userData.department || 'Computer Science',
          userData.designation || 'Faculty',
          userData.staffId || null,
        ]
      );
    }

    const created = await this.findById(userId);
    if (!created) {
      throw new Error('Failed to retrieve user after creation in PostgreSQL');
    }
    return created;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    if (updateData.name || updateData.email || updateData.passwordHash || updateData.role) {
      await pool.query(
        `UPDATE users SET
           name = COALESCE($1, name),
           email = COALESCE($2, email),
           password_hash = COALESCE($3, password_hash),
           role = COALESCE($4, role),
           updated_at = NOW()
         WHERE id = $5`,
        [
          updateData.name || null,
          updateData.email ? updateData.email.toLowerCase() : null,
          updateData.passwordHash || null,
          updateData.role || null,
          id,
        ]
      );
    }

    if (existing.role === 'STUDENT') {
      await pool.query(
        `UPDATE students SET
           department = COALESCE($1, department),
           phone = COALESCE($2, phone),
           register_number = COALESCE($3, register_number),
           year = COALESCE($4, year),
           updated_at = NOW()
         WHERE user_id = $5`,
        [
          updateData.department || null,
          updateData.phone || null,
          updateData.rollNumber || null,
          updateData.year || null,
          id,
        ]
      );
    } else if (existing.role === 'STAFF') {
      await pool.query(
        `UPDATE staff SET
           department = COALESCE($1, department),
           designation = COALESCE($2, designation),
           employee_id = COALESCE($3, employee_id),
           updated_at = NOW()
         WHERE user_id = $4`,
        [
          updateData.department || null,
          updateData.designation || null,
          updateData.staffId || null,
          id,
        ]
      );
    }

    return this.findById(id);
  }

  sanitizeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = user;
    return safe;
  }
}

export const postgresUserRepository = new PostgresUserRepository();
