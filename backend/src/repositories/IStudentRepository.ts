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

export interface IStudentRepository {
  getDashboardData(studentId: string): Promise<StudentDashboardSummary | null>;
  getAttendanceData(studentId: string): Promise<{
    trend: AttendanceTrend[];
    subjects: AttendanceSubject[];
    calendar: CalendarDay[];
    stats: {
      overallPercentage: number;
      classesAttended: number;
      totalClasses: number;
      safeBunksAvailable: number;
    };
  }>;
  getAcademicsData(studentId: string): Promise<{
    subjectScores: SubjectScore[];
    performanceTrend: PerformanceTrend[];
    weakSubjects: WeakSubject[];
    studyPlan: StudyPlanDay[];
    semesterHistory: Array<{ semester: string; gpa: number }>;
  }>;
  getPlacementData(studentId: string): Promise<StudentPlacementData>;
}
