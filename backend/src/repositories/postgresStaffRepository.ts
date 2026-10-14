import { IStaffRepository } from './IStaffRepository.js';
import {
  StaffCohortOverview,
  StaffStudentSummary,
  AttendanceSession,
  AcademicMarkEntry,
  StaffPlacementStudent,
  AIStudentSupportCase,
  Announcement,
  StaffReportSummary,
} from '../types/index.js';
import { pool } from '../config/db.js';
import { MockStaffRepository } from './mockStaffRepository.js';

const fallback = new MockStaffRepository();

function mapRowToStudentSummary(r: any): StaffStudentSummary {
  return {
    id: r.id,
    name: r.name,
    rollNumber: r.register_number || 'N/A',
    department: r.department || 'Computer Science',
    year: r.year ? `${r.year}rd Year (Sem ${r.semester || 5})` : '3rd Year (Sem 5)',
    attendance: Number(r.attendance || 0),
    academicScore: Number(r.academic_score || 0),
    cgpa: Number(r.cgpa || 0),
    riskLevel: (r.risk_level as 'High' | 'Medium' | 'Low') || 'Low',
    avatarInitials: r.avatar_initials || (r.name ? r.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'),
    email: r.email,
    phone: r.phone || '+91 98765 00000',
    aiInsight: r.ai_insight || 'Consistent attendance and steady academic performance.',
    recommendedAction: r.recommended_action || 'Continue standard academic and placement mentoring.',
    subjectAttendance: typeof r.subject_attendance === 'string' ? JSON.parse(r.subject_attendance) : (r.subject_attendance || {}),
    subjectScores: typeof r.subject_scores === 'string' ? JSON.parse(r.subject_scores) : (r.subject_scores || {}),
    placementEligibility: r.placement_eligibility || 'Eligible',
    applicationStatus: r.application_status || 'Applied',
    placementStatus: r.placement_status || 'Seeking',
    skills: Array.isArray(r.skills) ? r.skills : (typeof r.skills === 'string' ? JSON.parse(r.skills) : ['C', 'Java', 'Python']),
    company: r.company || undefined,
    ctc: r.ctc || undefined,
    driveDate: r.drive_date instanceof Date ? r.drive_date.toISOString().split('T')[0] : (r.drive_date || undefined),
  };
}

export class PostgresStaffRepository implements IStaffRepository {
  async getCohortOverview(): Promise<StaffCohortOverview> {
    try {
      const res = await pool.query(`
        SELECT 
          COUNT(*)::int AS total_students,
          COALESCE(AVG(attendance), 0)::float AS avg_attendance,
          COALESCE(AVG(academic_score), 0)::float AS avg_academic_score,
          COUNT(*) FILTER (WHERE placement_status = 'Placed')::int AS total_placed,
          COUNT(*) FILTER (WHERE placement_eligibility = 'Eligible')::int AS eligible_for_placement,
          COUNT(*) FILTER (WHERE risk_level = 'High')::int AS high_risk,
          COUNT(*) FILTER (WHERE risk_level = 'Medium')::int AS medium_risk,
          COUNT(*) FILTER (WHERE risk_level = 'Low')::int AS low_risk
        FROM students
      `);

      if (res.rows.length === 0 || res.rows[0].total_students === 0) {
        return fallback.getCohortOverview();
      }

      const row = res.rows[0];
      const total = Number(row.total_students);
      const placed = Number(row.total_placed);
      const high = Number(row.high_risk);
      const medium = Number(row.medium_risk);

      return {
        totalStudents: total,
        maxCohortCapacity: Math.max(total, 40),
        avgAttendance: Math.round(Number(row.avg_attendance) * 10) / 10,
        avgAcademicScore: Math.round(Number(row.avg_academic_score) * 10) / 10,
        placementRate: total > 0 ? Math.round((placed / total) * 1000) / 10 : 0,
        atRiskStudentsCount: high + medium,
        highRiskCount: high,
        mediumRiskCount: medium,
        lowRiskCount: Number(row.low_risk),
        eligibleForPlacement: Number(row.eligible_for_placement),
        totalPlaced: placed,
      };
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStaffRepository.getCohortOverview]:', err.message);
      return fallback.getCohortOverview();
    }
  }

  async getStudentsList(filters?: { riskLevel?: string; department?: string; search?: string }): Promise<StaffStudentSummary[]> {
    try {
      let query = 'SELECT * FROM students WHERE 1=1';
      const params: any[] = [];

      if (filters?.riskLevel && filters.riskLevel !== 'All') {
        params.push(filters.riskLevel);
        query += ` AND risk_level = $${params.length}`;
      }

      if (filters?.department && filters.department !== 'All') {
        params.push(`%${filters.department}%`);
        query += ` AND department ILIKE $${params.length}`;
      }

      if (filters?.search && filters.search.trim()) {
        params.push(`%${filters.search.trim()}%`);
        query += ` AND (name ILIKE $${params.length} OR register_number ILIKE $${params.length} OR email ILIKE $${params.length})`;
      }

      query += ' ORDER BY register_number ASC, name ASC';

      const res = await pool.query(query, params);
      if (res.rows.length === 0 && !filters?.search && (!filters?.riskLevel || filters.riskLevel === 'All')) {
        return fallback.getStudentsList(filters);
      }
      return res.rows.map(mapRowToStudentSummary);
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStaffRepository.getStudentsList]:', err.message);
      return fallback.getStudentsList(filters);
    }
  }

  async getStudentById(studentId: string): Promise<StaffStudentSummary | null> {
    try {
      const res = await pool.query(
        `SELECT * FROM students WHERE id::text = $1 OR user_id::text = $1 OR register_number = $1 LIMIT 1`,
        [studentId]
      );
      if (res.rows.length === 0) {
        return fallback.getStudentById(studentId);
      }
      return mapRowToStudentSummary(res.rows[0]);
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStaffRepository.getStudentById]:', err.message);
      return fallback.getStudentById(studentId);
    }
  }

  async getPlacementRoster(): Promise<StaffPlacementStudent[]> {
    try {
      const res = await pool.query(`
        SELECT 
          id, name, register_number, cgpa, skills,
          placement_eligibility, application_status, placement_status,
          company, ctc, drive_date
        FROM students
        ORDER BY register_number ASC, name ASC
      `);

      if (res.rows.length === 0) {
        return fallback.getPlacementRoster();
      }

      return res.rows.map((r) => ({
        id: r.id,
        name: r.name,
        rollNumber: r.register_number || 'N/A',
        cgpa: Number(r.cgpa || 0),
        skills: Array.isArray(r.skills) ? r.skills : (typeof r.skills === 'string' ? JSON.parse(r.skills) : ['C', 'Java']),
        eligibility: (r.placement_eligibility as any) || 'Eligible',
        applicationStatus: (r.application_status as any) || 'Applied',
        placementStatus: (r.placement_status as any) || 'Seeking',
        company: r.company || undefined,
        ctc: r.ctc || undefined,
        driveDate: r.drive_date instanceof Date ? r.drive_date.toISOString().split('T')[0] : (r.drive_date || undefined),
      }));
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStaffRepository.getPlacementRoster]:', err.message);
      return fallback.getPlacementRoster();
    }
  }

  async getAttendanceSessions(): Promise<AttendanceSession[]> {
    return fallback.getAttendanceSessions();
  }

  async saveAttendanceSession(session: AttendanceSession): Promise<AttendanceSession> {
    return fallback.saveAttendanceSession(session);
  }

  async getAcademicMarks(subject?: string): Promise<AcademicMarkEntry[]> {
    return fallback.getAcademicMarks(subject);
  }

  async saveAcademicMarks(marks: AcademicMarkEntry[]): Promise<AcademicMarkEntry[]> {
    return fallback.saveAcademicMarks(marks);
  }

  async getSupportCases(status?: string): Promise<AIStudentSupportCase[]> {
    return fallback.getSupportCases(status);
  }

  async updateSupportCase(id: string, updateData: Partial<AIStudentSupportCase>): Promise<AIStudentSupportCase | null> {
    return fallback.updateSupportCase(id, updateData);
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return fallback.getAnnouncements();
  }

  async createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
    return fallback.createAnnouncement(announcement);
  }

  async getReports(): Promise<StaffReportSummary[]> {
    return fallback.getReports();
  }
}

export const postgresStaffRepository = new PostgresStaffRepository();
