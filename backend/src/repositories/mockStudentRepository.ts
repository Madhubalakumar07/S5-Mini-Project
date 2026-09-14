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
import { userRepository } from './mockUserRepository.js';

export class MockStudentRepository implements IStudentRepository {
  private defaultAttendanceTrend: AttendanceTrend[] = [
    { week: 'Week 1', percentage: 88 },
    { week: 'Week 2', percentage: 85 },
    { week: 'Week 3', percentage: 91 },
    { week: 'Week 4', percentage: 89 },
    { week: 'Week 5', percentage: 94 },
    { week: 'Week 6', percentage: 90 },
    { week: 'Week 7', percentage: 96 },
    { week: 'Week 8', percentage: 92 },
  ];

  private defaultSubjects: AttendanceSubject[] = [
    { subject: 'Data Structures & Algorithms', faculty: 'Dr. Priya Sharma', attended: 32, total: 35, percentage: 91.4, status: 'Good' },
    { subject: 'Database Management Systems', faculty: 'Dr. Rajesh Kumar', attended: 28, total: 32, percentage: 87.5, status: 'Good' },
    { subject: 'Operating Systems', faculty: 'Dr. Arun Patel', attended: 24, total: 30, percentage: 80.0, status: 'Good' },
    { subject: 'Computer Networks', faculty: 'Dr. Ravi Chandran', attended: 21, total: 29, percentage: 72.4, status: 'At Risk' },
    { subject: 'Artificial Intelligence & ML', faculty: 'Dr. Meena Krishnan', attended: 30, total: 32, percentage: 93.8, status: 'Excellent' },
  ];

  private defaultCalendar: CalendarDay[] = [
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
    { date: 5, month: 8, year: 2026, status: 'absent', classes: [
      { subject: 'Computer Networks', time: '9:00 AM', status: 'Absent', recognitionMethod: 'Manual Entry' },
      { subject: 'Data Structures', time: '11:00 AM', status: 'Absent', recognitionMethod: 'Manual Entry' },
    ]},
  ];

  private defaultSubjectScores: SubjectScore[] = [
    { subject: 'Data Structures', score: 88, maxScore: 100, trend: 'down' },
    { subject: 'DBMS', score: 82, maxScore: 100, trend: 'stable' },
    { subject: 'Operating Systems', score: 76, maxScore: 100, trend: 'down' },
    { subject: 'Computer Networks', score: 72, maxScore: 100, trend: 'down' },
    { subject: 'AI & ML', score: 91, maxScore: 100, trend: 'up' },
  ];

  private defaultPerformanceTrend: PerformanceTrend[] = [
    { assessment: 'Internal 1', dataStructures: 82, dbms: 79, os: 74, cn: 70, aiml: 88 },
    { assessment: 'Internal 2', dataStructures: 85, dbms: 81, os: 72, cn: 68, aiml: 90 },
    { assessment: 'Assignment', dataStructures: 90, dbms: 85, os: 78, cn: 74, aiml: 92 },
    { assessment: 'Model Exam', dataStructures: 88, dbms: 82, os: 76, cn: 72, aiml: 91 },
  ];

  private defaultWeakSubjects: WeakSubject[] = [
    {
      subject: 'Computer Networks',
      score: 72,
      status: 'Needs Improvement',
      recommendation: 'Focus on Routing Algorithms, TCP/IP Protocol Stack, and Network Security fundamentals.',
      topics: ['Routing Algorithms', 'TCP/IP', 'Network Security', 'Subnetting'],
    },
    {
      subject: 'Operating Systems',
      score: 76,
      status: 'Needs Attention',
      recommendation: 'Revise Process Scheduling algorithms, Deadlock detection, and Memory Management.',
      topics: ['Process Scheduling', 'Deadlocks', 'Memory Management', 'File Systems'],
    },
  ];

  private defaultStudyPlan: StudyPlanDay[] = [
    { day: 'MON', subject: 'Data Structures', duration: 45, completed: true, type: 'theory' },
    { day: 'TUE', subject: 'Operating Systems', duration: 40, completed: true, type: 'theory' },
    { day: 'WED', subject: 'Coding Practice', duration: 60, completed: false, type: 'practice' },
    { day: 'THU', subject: 'Computer Networks', duration: 45, completed: false, type: 'theory' },
    { day: 'FRI', subject: 'DBMS', duration: 40, completed: false, type: 'theory' },
    { day: 'SAT', subject: 'Mock Test', duration: 90, completed: false, type: 'mock' },
  ];

  async getDashboardData(studentId: string): Promise<StudentDashboardSummary | null> {
    const user = await userRepository.findById(studentId);
    if (!user) return null;

    const safeUser = userRepository.sanitizeUser(user);

    return {
      student: safeUser,
      attendance: {
        percentage: 92.4,
        monthChange: 2.1,
        classesAttended: 186,
        classesMissed: 15,
        streak: 12,
        label: 'Good Standing',
      },
      academics: {
        cgpa: safeUser.cgpa ?? 8.4,
        semesterGpa: 8.7,
        cgpaChange: 0.3,
        avgInternal: 84,
        examReadiness: 81,
        label: '↑ 0.3 this semester',
      },
      coding: {
        totalSolved: 248,
        weekSolved: 12,
        streak: 18,
        label: '12 solved this week',
      },
      placement: {
        score: 78,
        label: 'Good Progress',
        maxScore: 100,
      },
      upcomingEvents: [
        { date: 'Aug 09', event: 'DBMS Internal Assessment', type: 'exam', icon: '📝' },
        { date: 'Aug 11', event: 'Placement Aptitude Test', type: 'placement', icon: '💼' },
        { date: 'Aug 14', event: 'Resume Review', type: 'career', icon: '📄' },
        { date: 'Aug 18', event: 'Mock Interview', type: 'interview', icon: '🎯' },
      ],
      notifications: [
        { id: '1', type: 'warning', message: 'Computer Networks attendance below 75%', time: '2 hours ago', read: false },
        { id: '2', type: 'success', message: 'DSA weekly goal completed! 🎉', time: '5 hours ago', read: false },
        { id: '3', type: 'calendar', message: 'DBMS exam in 3 days — review scheduled', time: '1 day ago', read: true },
        { id: '4', type: 'info', message: 'Resume profile is 90% complete', time: '2 days ago', read: true },
        { id: '5', type: 'ai', message: 'New AI recommendation available for DSA', time: '3 days ago', read: true },
      ],
    };
  }

  async getAttendanceData(studentId: string) {
    return {
      trend: this.defaultAttendanceTrend,
      subjects: this.defaultSubjects,
      calendar: this.defaultCalendar,
      stats: {
        overallPercentage: 92.4,
        classesAttended: 186,
        totalClasses: 201,
        safeBunksAvailable: 4,
      },
    };
  }

  async getAcademicsData(studentId: string) {
    return {
      subjectScores: this.defaultSubjectScores,
      performanceTrend: this.defaultPerformanceTrend,
      weakSubjects: this.defaultWeakSubjects,
      studyPlan: this.defaultStudyPlan,
      semesterHistory: [
        { semester: 'Sem 1', gpa: 7.8 },
        { semester: 'Sem 2', gpa: 8.1 },
        { semester: 'Sem 3', gpa: 8.0 },
        { semester: 'Sem 4', gpa: 8.3 },
        { semester: 'Sem 5', gpa: 8.7 },
      ],
    };
  }

  async getPlacementData(studentId: string): Promise<StudentPlacementData> {
    return {
      placementScore: {
        score: 78,
        maxScore: 100,
        status: 'Good Progress',
        trend: '+5 this month',
      },
      placementBreakdown: [
        { label: 'Technical Skills', value: 82, icon: '⚙️' },
        { label: 'Coding', value: 74, icon: '💻' },
        { label: 'Communication', value: 68, icon: '🗣️' },
        { label: 'Resume', value: 90, icon: '📄' },
        { label: 'Interview Preparation', value: 71, icon: '🎯' },
      ],
      careerRoadmap: [
        { step: 1, title: 'Resume', progress: 100, completed: true, description: 'Professional resume with all key sections' },
        { step: 2, title: 'DSA Preparation', progress: 72, completed: false, description: '248/345 problems solved across platforms' },
        { step: 3, title: 'Core CS Subjects', progress: 65, completed: false, description: 'OS, Networks, DBMS, Algorithms' },
        { step: 4, title: 'Aptitude', progress: 58, completed: false, description: 'Quantitative, Verbal, and Logical reasoning' },
        { step: 5, title: 'Mock Interviews', progress: 40, completed: false, description: '2/5 mock interviews completed' },
        { step: 6, title: 'Placement Applications', progress: 25, completed: false, description: 'Applied to 3 out of target 12 companies' },
      ],
      recommendedCompanies: [
        { name: 'TCS', logo: 'TCS', matchPercentage: 92, skillsMatched: 8, totalSkills: 9, ctc: '3.36 LPA', roles: ['Software Engineer', 'System Engineer'], color: '#004B8D' },
        { name: 'Infosys', logo: 'INFY', matchPercentage: 88, skillsMatched: 7, totalSkills: 9, ctc: '3.60 LPA', roles: ['Systems Engineer', 'Associate'], color: '#007CC3' },
        { name: 'Accenture', logo: 'ACN', matchPercentage: 84, skillsMatched: 7, totalSkills: 9, ctc: '4.50 LPA', roles: ['Associate Software Engineer'], color: '#A100FF' },
        { name: 'Zoho', logo: 'ZHO', matchPercentage: 78, skillsMatched: 6, totalSkills: 9, ctc: '5.00 LPA', roles: ['Software Developer', 'Member Technical Staff'], color: '#E42527' },
      ],
      resumeChecklist: [
        { label: 'Personal Information', completed: true },
        { label: 'Education Details', completed: true },
        { label: 'Technical Skills', completed: true },
        { label: 'Projects (3 listed)', completed: true },
        { label: 'Coding Profiles', completed: true },
        { label: 'Certifications', completed: true },
        { label: 'Achievements & Awards', completed: false },
      ],
      mockInterview: {
        type: 'Technical Interview',
        date: 'August 18, 2026',
        time: '11:00 AM',
        interviewer: 'AI Practice Interview',
        topics: ['Data Structures', 'Algorithms', 'System Design Basics'],
      },
    };
  }
}

export const studentRepository = new MockStudentRepository();
