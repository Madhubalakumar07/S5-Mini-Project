import { studentRepository } from '../repositories/mockStudentRepository.js';

export const studentService = {
  /**
   * Get dashboard summary strictly scoped to the authenticated student's own ID.
   * Never accepts a studentId override from the frontend.
   */
  async getDashboard(authenticatedStudentId: string) {
    const data = await studentRepository.getDashboardData(authenticatedStudentId);
    if (!data) {
      const err = new Error('Student data not found.');
      (err as any).statusCode = 404;
      throw err;
    }
    return data;
  },

  async getAttendance(authenticatedStudentId: string) {
    return studentRepository.getAttendanceData(authenticatedStudentId);
  },

  async getAcademics(authenticatedStudentId: string) {
    return studentRepository.getAcademicsData(authenticatedStudentId);
  },

  async getPlacement(authenticatedStudentId: string) {
    return studentRepository.getPlacementData(authenticatedStudentId);
  },
};
