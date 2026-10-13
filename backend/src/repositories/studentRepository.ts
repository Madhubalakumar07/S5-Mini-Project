import { IStudentRepository } from './IStudentRepository.js';
import { postgresStudentRepository } from './postgresStudentRepository.js';
import { MockStudentRepository } from './mockStudentRepository.js';
import {
  StudentDashboardSummary,
  AttendanceSubject,
  AttendanceTrend,
  CalendarDay,
  SubjectScore,
  PerformanceTrend,
  WeakSubject,
  StudyPlanDay,
  StudentPlacementData,
} from '../types/index.js';

const fallbackRepo = new MockStudentRepository();

export class HybridStudentRepository implements IStudentRepository {
  async getDashboardData(studentId: string): Promise<StudentDashboardSummary | null> {
    try {
      return await postgresStudentRepository.getDashboardData(studentId);
    } catch (err: any) {
      console.warn(`[StudentRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getDashboardData(studentId);
    }
  }

  async getAttendanceData(studentId: string): Promise<{
    trend: AttendanceTrend[];
    subjects: AttendanceSubject[];
    calendar: CalendarDay[];
    stats: {
      overallPercentage: number;
      classesAttended: number;
      totalClasses: number;
      safeBunksAvailable: number;
    };
  }> {
    try {
      return await postgresStudentRepository.getAttendanceData(studentId);
    } catch (err: any) {
      console.warn(`[StudentRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getAttendanceData(studentId);
    }
  }

  async getAcademicsData(studentId: string): Promise<{
    subjectScores: SubjectScore[];
    performanceTrend: PerformanceTrend[];
    weakSubjects: WeakSubject[];
    studyPlan: StudyPlanDay[];
    semesterHistory: Array<{ semester: string; gpa: number }>;
  }> {
    try {
      return await postgresStudentRepository.getAcademicsData(studentId);
    } catch (err: any) {
      console.warn(`[StudentRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getAcademicsData(studentId);
    }
  }

  async getPlacementData(studentId: string): Promise<StudentPlacementData> {
    try {
      return await postgresStudentRepository.getPlacementData(studentId);
    } catch (err: any) {
      console.warn(`[StudentRepo Warning] DB query failed (${err.message}), using fallback.`);
      return fallbackRepo.getPlacementData(studentId);
    }
  }
}

export const studentRepository = new HybridStudentRepository();
export { postgresStudentRepository };
