import { IStudentRepository } from './IStudentRepository.js';
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
import { pool } from '../config/db.js';
import { userRepository } from './userRepository.js';
import { MockStudentRepository } from './mockStudentRepository.js';

const fallback = new MockStudentRepository();

export class PostgresStudentRepository implements IStudentRepository {
  private async findStudentRow(studentId: string) {
    try {
      const res = await pool.query(
        `SELECT * FROM students WHERE user_id::text = $1 OR id::text = $1 OR register_number = $1 LIMIT 1`,
        [studentId]
      );
      return res.rows[0] || null;
    } catch {
      return null;
    }
  }

  async getDashboardData(studentId: string): Promise<StudentDashboardSummary | null> {
    try {
      const studentRow = await this.findStudentRow(studentId);
      const user = await userRepository.findById(studentId);

      if (!studentRow && !user) {
        return fallback.getDashboardData(studentId);
      }

      const safeUser = user ? userRepository.sanitizeUser(user) : {
        id: studentRow?.user_id || studentRow?.id || studentId,
        name: studentRow?.name || 'Student',
        email: studentRow?.email || '',
        role: 'STUDENT' as const,
        department: studentRow?.department || 'Computer Science',
        rollNumber: studentRow?.register_number,
        cgpa: Number(studentRow?.cgpa || 8.0),
        phone: studentRow?.phone,
        createdAt: studentRow?.created_at || new Date().toISOString(),
        updatedAt: studentRow?.updated_at || new Date().toISOString(),
      };

      const attendancePct = Number(studentRow?.attendance || 90.0);
      const cgpa = Number(studentRow?.cgpa || 8.0);
      const academicScore = Number(studentRow?.academic_score || 80);
      const codingSolved = Number(studentRow?.coding_solved || 150);
      const codingWeekSolved = Number(studentRow?.coding_week_solved || 8);
      const codingStreak = Number(studentRow?.coding_streak || 10);
      const placementScore = Number(studentRow?.placement_score || 75);

      const classesTotal = 200;
      const classesAttended = Math.round((attendancePct / 100) * classesTotal);
      const classesMissed = classesTotal - classesAttended;

      return {
        student: safeUser,
        attendance: {
          percentage: attendancePct,
          monthChange: 1.5,
          classesAttended,
          classesMissed,
          streak: Math.min(18, Math.round(attendancePct / 5)),
          label: attendancePct >= 85 ? 'Good Standing' : (attendancePct >= 75 ? 'Acceptable' : 'Attendance Warning'),
        },
        academics: {
          cgpa,
          semesterGpa: Math.min(10, Math.round((cgpa + 0.2) * 10) / 10),
          cgpaChange: 0.2,
          avgInternal: academicScore,
          examReadiness: Math.min(98, Math.round(academicScore * 0.95)),
          label: `↑ 0.2 this semester`,
        },
        coding: {
          totalSolved: codingSolved,
          weekSolved: codingWeekSolved,
          streak: codingStreak,
          label: `${codingWeekSolved} solved this week`,
        },
        placement: {
          score: placementScore,
          label: studentRow?.placement_status || 'Good Progress',
          maxScore: 100,
        },
        upcomingEvents: [
          { date: 'Aug 14', event: 'Internal Assessment Review', type: 'exam', icon: '📝' },
          { date: 'Aug 18', event: 'Campus Placement Mock Test', type: 'placement', icon: '💼' },
          { date: 'Aug 22', event: 'Resume & Portfolio Verification', type: 'career', icon: '📄' },
          { date: 'Aug 25', event: 'Technical Mock Interview', type: 'interview', icon: '🎯' },
        ],
        notifications: [
          {
            id: '1',
            type: attendancePct < 75 ? 'warning' : 'info',
            message: attendancePct < 75 ? 'Attendance is currently below statutory 75%' : 'Your attendance record is in good standing',
            time: '2 hours ago',
            read: false,
          },
          {
            id: '2',
            type: 'success',
            message: `DSA streak active: ${codingStreak} days in a row! 🚀`,
            time: '5 hours ago',
            read: false,
          },
          {
            id: '3',
            type: 'calendar',
            message: 'Campus recruitment drive registration open',
            time: '1 day ago',
            read: true,
          },
        ],
      };
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStudentRepository.getDashboardData]:', err.message);
      return fallback.getDashboardData(studentId);
    }
  }

  async getAttendanceData(studentId: string) {
    try {
      const studentRow = await this.findStudentRow(studentId);
      if (!studentRow) {
        return fallback.getAttendanceData(studentId);
      }

      const attendancePct = Number(studentRow.attendance || 90.0);
      const totalClasses = 200;
      const attended = Math.round((attendancePct / 100) * totalClasses);

      // Safe bunks calculation: attended / (totalClasses + bunks) >= 0.75 => attended / 0.75 - totalClasses
      const maxAllowedClassesToKeep75 = Math.floor(attended / 0.75);
      const safeBunks = Math.max(0, maxAllowedClassesToKeep75 - totalClasses);

      let subjects: AttendanceSubject[] = [];
      const subAtt = typeof studentRow.subject_attendance === 'string'
        ? JSON.parse(studentRow.subject_attendance)
        : (studentRow.subject_attendance || {});

      if (Object.keys(subAtt).length > 0) {
        subjects = Object.entries(subAtt).map(([subject, data]: [string, any]) => {
          const p = Number(data.percentage || 80);
          return {
            subject,
            faculty: 'Faculty In-Charge',
            attended: Number(data.attended || 25),
            total: Number(data.total || 30),
            percentage: p,
            status: p >= 90 ? 'Excellent' : (p >= 75 ? 'Good' : (p >= 65 ? 'At Risk' : 'Critical')),
          };
        });
      } else {
        const fb = await fallback.getAttendanceData(studentId);
        subjects = fb.subjects;
      }

      const trend: AttendanceTrend[] = [
        { week: 'Week 1', percentage: Math.max(60, attendancePct - 4) },
        { week: 'Week 2', percentage: Math.max(60, attendancePct - 2) },
        { week: 'Week 3', percentage: Math.min(100, attendancePct + 1) },
        { week: 'Week 4', percentage: attendancePct },
        { week: 'Week 5', percentage: Math.min(100, attendancePct + 2) },
        { week: 'Week 6', percentage: attendancePct },
        { week: 'Week 7', percentage: Math.min(100, attendancePct + 1) },
        { week: 'Week 8', percentage: attendancePct },
      ];

      const calendar: CalendarDay[] = [
        { date: 1, month: 8, year: 2026, status: 'holiday' },
        { date: 2, month: 8, year: 2026, status: 'holiday' },
        { date: 3, month: 8, year: 2026, status: 'present', classes: [
          { subject: 'Data Structures', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
          { subject: 'DBMS', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
        ]},
        { date: 4, month: 8, year: 2026, status: 'present', classes: [
          { subject: 'Operating Systems', time: '10:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
          { subject: 'AI & ML', time: '2:00 PM', status: 'Present', recognitionMethod: 'Face Recognition' },
        ]},
        { date: 5, month: 8, year: 2026, status: attendancePct < 75 ? 'absent' : 'present', classes: [
          { subject: 'Computer Networks', time: '9:00 AM', status: attendancePct < 75 ? 'Absent' : 'Present', recognitionMethod: 'Face Recognition' },
          { subject: 'Data Structures', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
        ]},
      ];

      return {
        trend,
        subjects,
        calendar,
        stats: {
          overallPercentage: attendancePct,
          classesAttended: attended,
          totalClasses,
          safeBunksAvailable: safeBunks,
        },
      };
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStudentRepository.getAttendanceData]:', err.message);
      return fallback.getAttendanceData(studentId);
    }
  }

  async getAcademicsData(studentId: string) {
    try {
      const studentRow = await this.findStudentRow(studentId);
      if (!studentRow) {
        return fallback.getAcademicsData(studentId);
      }

      const scoresJson = typeof studentRow.subject_scores === 'string'
        ? JSON.parse(studentRow.subject_scores)
        : (studentRow.subject_scores || {});

      let subjectScores: SubjectScore[] = [];
      if (Object.keys(scoresJson).length > 0) {
        subjectScores = Object.entries(scoresJson).map(([subject, data]: [string, any]) => ({
          subject,
          score: Number(data.marks || 75),
          maxScore: Number(data.maxMarks || 100),
          trend: (Number(data.marks || 75) >= 80 ? 'up' : (Number(data.marks || 75) >= 70 ? 'stable' : 'down')) as 'up' | 'down' | 'stable',
        }));
      } else {
        const fb = await fallback.getAcademicsData(studentId);
        subjectScores = fb.subjectScores;
      }

      const semHist = typeof studentRow.semester_history === 'string'
        ? JSON.parse(studentRow.semester_history)
        : (studentRow.semester_history || []);

      const semesterHistory = Array.isArray(semHist) && semHist.length > 0
        ? semHist
        : [
            { semester: 'Sem 1', gpa: 7.8 },
            { semester: 'Sem 2', gpa: 8.0 },
            { semester: 'Sem 3', gpa: 8.2 },
            { semester: 'Sem 4', gpa: 8.3 },
            { semester: 'Sem 5', gpa: Number(studentRow.cgpa || 8.4) },
          ];

      const weakSubs: WeakSubject[] = subjectScores
        .filter(s => s.score < 75)
        .map(s => ({
          subject: s.subject,
          score: s.score,
          status: s.score < 60 ? 'Needs Attention' : 'Needs Improvement',
          recommendation: `Targeted revision and practice sets recommended for core topics in ${s.subject}.`,
          topics: ['Core Concepts', 'Problem Solving', 'Exam Practice'],
        }));

      const performanceTrend: PerformanceTrend[] = [
        { assessment: 'Internal 1', dataStructures: 80, dbms: 78, os: 72, cn: 70, aiml: 85 },
        { assessment: 'Internal 2', dataStructures: 84, dbms: 80, os: 74, cn: 72, aiml: 88 },
        { assessment: 'Assignment', dataStructures: 88, dbms: 85, os: 80, cn: 76, aiml: 92 },
        { assessment: 'Model Exam', dataStructures: 86, dbms: 82, os: 78, cn: 74, aiml: 90 },
      ];

      const studyPlan: StudyPlanDay[] = [
        { day: 'MON', subject: 'Data Structures', duration: 45, completed: true, type: 'theory' },
        { day: 'TUE', subject: 'Operating Systems', duration: 40, completed: true, type: 'theory' },
        { day: 'WED', subject: 'Coding Practice', duration: 60, completed: false, type: 'practice' },
        { day: 'THU', subject: 'Computer Networks', duration: 45, completed: false, type: 'theory' },
        { day: 'FRI', subject: 'DBMS', duration: 40, completed: false, type: 'theory' },
        { day: 'SAT', subject: 'Mock Test', duration: 90, completed: false, type: 'mock' },
      ];

      return {
        subjectScores,
        performanceTrend,
        weakSubjects: weakSubs.length > 0 ? weakSubs : [
          {
            subject: 'Computer Networks',
            score: 74,
            status: 'Needs Improvement' as const,
            recommendation: 'Focus on Routing Algorithms and TCP/IP protocol stack.',
            topics: ['Routing Algorithms', 'TCP/IP', 'Subnetting'],
          }
        ],
        studyPlan,
        semesterHistory,
      };
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStudentRepository.getAcademicsData]:', err.message);
      return fallback.getAcademicsData(studentId);
    }
  }

  async getPlacementData(studentId: string): Promise<StudentPlacementData> {
    try {
      const studentRow = await this.findStudentRow(studentId);
      if (!studentRow) {
        return fallback.getPlacementData(studentId);
      }

      const score = Number(studentRow.placement_score || 75);
      const skills: string[] = Array.isArray(studentRow.skills)
        ? studentRow.skills
        : (typeof studentRow.skills === 'string' ? JSON.parse(studentRow.skills) : ['Java', 'Python']);

      return {
        placementScore: {
          score,
          maxScore: 100,
          status: studentRow.placement_status || 'Good Progress',
          trend: '+5 this month',
        },
        placementBreakdown: [
          { label: 'Technical Skills', value: Math.min(95, score + 4), icon: '⚙️' },
          { label: 'Coding', value: Math.min(95, Math.round(Number(studentRow.coding_solved || 150) / 4)), icon: '💻' },
          { label: 'Communication', value: 78, icon: '🗣️' },
          { label: 'Resume', value: 90, icon: '📄' },
          { label: 'Interview Preparation', value: Math.min(95, score - 3), icon: '🎯' },
        ],
        careerRoadmap: [
          { step: 1, title: 'Resume', progress: 100, completed: true, description: 'Verified resume with core projects' },
          { step: 2, title: 'DSA Preparation', progress: Math.min(100, Math.round(Number(studentRow.coding_solved || 150) / 3)), completed: Number(studentRow.coding_solved || 0) >= 200, description: `${studentRow.coding_solved || 150} problems solved` },
          { step: 3, title: 'Core CS Subjects', progress: 75, completed: false, description: 'OS, DBMS, Networks' },
          { step: 4, title: 'Aptitude Practice', progress: 65, completed: false, description: 'Quantitative & Logical' },
          { step: 5, title: 'Mock Interviews', progress: 50, completed: false, description: 'Technical & HR rounds' },
          { step: 6, title: 'Company Drives', progress: studentRow.company ? 100 : 35, completed: studentRow.placement_status === 'Placed', description: studentRow.company ? `Selected at ${studentRow.company}` : 'Applications active' },
        ],
        recommendedCompanies: [
          { name: 'Zoho', logo: 'ZHO', matchPercentage: 92, skillsMatched: 7, totalSkills: 8, ctc: '5.50 LPA', roles: ['Software Developer', 'MTS'], color: '#E42527' },
          { name: 'Accenture', logo: 'ACN', matchPercentage: 88, skillsMatched: 7, totalSkills: 8, ctc: '6.50 LPA', roles: ['Associate Software Engineer'], color: '#A100FF' },
          { name: 'TCS', logo: 'TCS', matchPercentage: 85, skillsMatched: 6, totalSkills: 8, ctc: '3.80 LPA', roles: ['System Engineer'], color: '#004B8D' },
          { name: 'Infosys', logo: 'INFY', matchPercentage: 82, skillsMatched: 6, totalSkills: 8, ctc: '4.50 LPA', roles: ['Specialist Programmer'], color: '#007CC3' },
        ],
        resumeChecklist: [
          { label: 'Personal Information', completed: true },
          { label: 'Education Details', completed: true },
          { label: 'Technical Skills (' + skills.length + ' listed)', completed: true },
          { label: 'Projects & Repositories', completed: true },
          { label: 'Coding Profiles', completed: true },
          { label: 'Certifications', completed: true },
          { label: 'Achievements', completed: score > 80 },
        ],
        mockInterview: {
          type: 'Technical Interview',
          date: 'August 25, 2026',
          time: '11:00 AM',
          interviewer: 'AI Practice Evaluator',
          topics: skills.slice(0, 3),
        },
      };
    } catch (err: any) {
      console.warn('[DB Warning in PostgresStudentRepository.getPlacementData]:', err.message);
      return fallback.getPlacementData(studentId);
    }
  }
}

export const postgresStudentRepository = new PostgresStudentRepository();
