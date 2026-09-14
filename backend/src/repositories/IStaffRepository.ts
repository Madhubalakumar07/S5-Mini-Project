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

export interface IStaffRepository {
  getCohortOverview(): Promise<StaffCohortOverview>;
  getStudentsList(filters?: { riskLevel?: string; department?: string; search?: string }): Promise<StaffStudentSummary[]>;
  getStudentById(studentId: string): Promise<StaffStudentSummary | null>;
  getAttendanceSessions(): Promise<AttendanceSession[]>;
  saveAttendanceSession(session: AttendanceSession): Promise<AttendanceSession>;
  getAcademicMarks(subject?: string): Promise<AcademicMarkEntry[]>;
  saveAcademicMarks(marks: AcademicMarkEntry[]): Promise<AcademicMarkEntry[]>;
  getPlacementRoster(): Promise<StaffPlacementStudent[]>;
  getSupportCases(status?: string): Promise<AIStudentSupportCase[]>;
  updateSupportCase(id: string, updateData: Partial<AIStudentSupportCase>): Promise<AIStudentSupportCase | null>;
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement>;
  getReports(): Promise<StaffReportSummary[]>;
}
