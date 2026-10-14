import { IStaffRepository } from './IStaffRepository.js';
import { postgresStaffRepository } from './postgresStaffRepository.js';
import { MockStaffRepository } from './mockStaffRepository.js';
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

const fallbackRepo = new MockStaffRepository();

export class HybridStaffRepository implements IStaffRepository {
  async getCohortOverview(): Promise<StaffCohortOverview> {
    try {
      return await postgresStaffRepository.getCohortOverview();
    } catch (err: any) {
      console.warn(`[StaffRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getCohortOverview();
    }
  }

  async getStudentsList(filters?: { riskLevel?: string; department?: string; search?: string }): Promise<StaffStudentSummary[]> {
    try {
      return await postgresStaffRepository.getStudentsList(filters);
    } catch (err: any) {
      console.warn(`[StaffRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getStudentsList(filters);
    }
  }

  async getStudentById(studentId: string): Promise<StaffStudentSummary | null> {
    try {
      return await postgresStaffRepository.getStudentById(studentId);
    } catch (err: any) {
      console.warn(`[StaffRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getStudentById(studentId);
    }
  }

  async getAttendanceSessions(): Promise<AttendanceSession[]> {
    try {
      return await postgresStaffRepository.getAttendanceSessions();
    } catch {
      return fallbackRepo.getAttendanceSessions();
    }
  }

  async saveAttendanceSession(session: AttendanceSession): Promise<AttendanceSession> {
    try {
      return await postgresStaffRepository.saveAttendanceSession(session);
    } catch {
      return fallbackRepo.saveAttendanceSession(session);
    }
  }

  async getAcademicMarks(subject?: string): Promise<AcademicMarkEntry[]> {
    try {
      return await postgresStaffRepository.getAcademicMarks(subject);
    } catch {
      return fallbackRepo.getAcademicMarks(subject);
    }
  }

  async saveAcademicMarks(marks: AcademicMarkEntry[]): Promise<AcademicMarkEntry[]> {
    try {
      return await postgresStaffRepository.saveAcademicMarks(marks);
    } catch {
      return fallbackRepo.saveAcademicMarks(marks);
    }
  }

  async getPlacementRoster(): Promise<StaffPlacementStudent[]> {
    try {
      return await postgresStaffRepository.getPlacementRoster();
    } catch (err: any) {
      console.warn(`[StaffRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getPlacementRoster();
    }
  }

  async getSupportCases(status?: string): Promise<AIStudentSupportCase[]> {
    try {
      return await postgresStaffRepository.getSupportCases(status);
    } catch {
      return fallbackRepo.getSupportCases(status);
    }
  }

  async updateSupportCase(id: string, updateData: Partial<AIStudentSupportCase>): Promise<AIStudentSupportCase | null> {
    try {
      return await postgresStaffRepository.updateSupportCase(id, updateData);
    } catch {
      return fallbackRepo.updateSupportCase(id, updateData);
    }
  }

  async getAnnouncements(): Promise<Announcement[]> {
    try {
      return await postgresStaffRepository.getAnnouncements();
    } catch {
      return fallbackRepo.getAnnouncements();
    }
  }

  async createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
    try {
      return await postgresStaffRepository.createAnnouncement(announcement);
    } catch {
      return fallbackRepo.createAnnouncement(announcement);
    }
  }

  async getReports(): Promise<StaffReportSummary[]> {
    try {
      return await postgresStaffRepository.getReports();
    } catch {
      return fallbackRepo.getReports();
    }
  }
}

export const staffRepository = new HybridStaffRepository();
export { postgresStaffRepository };
