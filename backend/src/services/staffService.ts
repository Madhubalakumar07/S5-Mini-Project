import { staffRepository } from '../repositories/mockStaffRepository.js';
import { AttendanceSession, AcademicMarkEntry, AIStudentSupportCase, Announcement } from '../types/index.js';

export const staffService = {
  async getDashboard(staffId: string) {
    const [overview, students, announcements] = await Promise.all([
      staffRepository.getCohortOverview(),
      staffRepository.getStudentsList(),
      staffRepository.getAnnouncements(),
    ]);
    return { overview, recentStudents: students.slice(0, 5), recentAnnouncements: announcements.slice(0, 3) };
  },

  async getCohortOverview() {
    return staffRepository.getCohortOverview();
  },

  async getStudentsList(filters?: { riskLevel?: string; department?: string; search?: string }) {
    return staffRepository.getStudentsList(filters);
  },

  async getStudentById(studentId: string) {
    const student = await staffRepository.getStudentById(studentId);
    if (!student) {
      const err = new Error(`Student with ID '${studentId}' not found.`);
      (err as any).statusCode = 404;
      throw err;
    }
    return student;
  },

  async getAttendanceSessions() {
    return staffRepository.getAttendanceSessions();
  },

  async saveAttendanceSession(session: AttendanceSession) {
    return staffRepository.saveAttendanceSession(session);
  },

  async getAcademicMarks(subject?: string) {
    return staffRepository.getAcademicMarks(subject);
  },

  async saveAcademicMarks(marks: AcademicMarkEntry[]) {
    return staffRepository.saveAcademicMarks(marks);
  },

  async getPlacementRoster() {
    return staffRepository.getPlacementRoster();
  },

  async getSupportCases(status?: string) {
    return staffRepository.getSupportCases(status);
  },

  async updateSupportCase(id: string, updateData: Partial<AIStudentSupportCase>) {
    const updated = await staffRepository.updateSupportCase(id, updateData);
    if (!updated) {
      const err = new Error(`Support case '${id}' not found.`);
      (err as any).statusCode = 404;
      throw err;
    }
    return updated;
  },

  async getAnnouncements() {
    return staffRepository.getAnnouncements();
  },

  async createAnnouncement(announcementData: Omit<Announcement, 'id'>) {
    return staffRepository.createAnnouncement(announcementData);
  },

  async getReports() {
    return staffRepository.getReports();
  },
};
