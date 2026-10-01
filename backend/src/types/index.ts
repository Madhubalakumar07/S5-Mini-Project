// ─── Role Types ────────────────────────────────────────────────────────
export type Role = 'STUDENT' | 'STAFF';

// ─── User & Auth Types ──────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  department: string;
  rollNumber?: string;
  staffId?: string;
  designation?: string;
  batch?: string;
  year?: number;
  phone?: string;
  cgpa?: number;
  createdAt: string;
  updatedAt: string;
}


export type SafeUser = Omit<User, 'passwordHash'>;

export interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  role: Role;
  name: string;
  department: string;
}

export interface AuthResponseData {
  user: SafeUser;
  token: string;
  refreshToken?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  department: string;
  rollNumber?: string;
  phone?: string;
  batch?: string;
  cgpa?: number;
}

// ─── Student Domain Types ───────────────────────────────────────────────
export interface AttendanceSubject {
  subject: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
  status: 'Excellent' | 'Good' | 'At Risk' | 'Critical';
}

export interface AttendanceTrend {
  week: string;
  percentage: number;
}

export interface ClassRecord {
  subject: string;
  time: string;
  status: 'Present' | 'Absent' | 'Partial';
  recognitionMethod: string;
}

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  status: 'present' | 'absent' | 'partial' | 'holiday' | 'future';
  classes?: ClassRecord[];
}

export interface SubjectScore {
  subject: string;
  score: number;
  maxScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceTrend {
  assessment: string;
  dataStructures: number;
  dbms: number;
  os: number;
  cn: number;
  aiml: number;
}

export interface WeakSubject {
  subject: string;
  score: number;
  status: 'Needs Improvement' | 'Needs Attention';
  recommendation: string;
  topics: string[];
}

export interface StudyPlanDay {
  day: string;
  subject: string;
  duration: number;
  completed: boolean;
  type: 'theory' | 'practice' | 'mock';
}

export interface StudentDashboardSummary {
  student: SafeUser;
  attendance: {
    percentage: number;
    monthChange: number;
    classesAttended: number;
    classesMissed: number;
    streak: number;
    label: string;
  };
  academics: {
    cgpa: number;
    semesterGpa: number;
    cgpaChange: number;
    avgInternal: number;
    examReadiness: number;
    label: string;
  };
  coding: {
    totalSolved: number;
    weekSolved: number;
    streak: number;
    label: string;
  };
  placement: {
    score: number;
    label: string;
    maxScore: number;
  };
  upcomingEvents: Array<{ date: string; event: string; type: string; icon: string }>;
  notifications: Array<{ id: string; type: string; message: string; time: string; read: boolean }>;
}

export interface StudentPlacementData {
  placementScore: {
    score: number;
    maxScore: number;
    status: string;
    trend: string;
  };
  placementBreakdown: Array<{ label: string; value: number; icon: string }>;
  careerRoadmap: Array<{ step: number; title: string; progress: number; completed: boolean; description: string }>;
  recommendedCompanies: Array<{
    name: string;
    logo: string;
    matchPercentage: number;
    skillsMatched: number;
    totalSkills: number;
    ctc: string;
    roles: string[];
    color: string;
  }>;
  resumeChecklist: Array<{ label: string; completed: boolean }>;
  mockInterview: {
    type: string;
    date: string;
    time: string;
    interviewer: string;
    topics: string[];
  };
}

// ─── Staff Domain Types ────────────────────────────────────────────────
export interface StaffCohortOverview {
  totalStudents: number;
  maxCohortCapacity: number;
  avgAttendance: number;
  avgAcademicScore: number;
  placementRate: number;
  atRiskStudentsCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  eligibleForPlacement: number;
  totalPlaced: number;
}

export interface StaffStudentSummary {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  attendance: number;
  academicScore: number;
  cgpa: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  avatarInitials: string;
  email: string;
  phone: string;
  aiInsight: string;
  recommendedAction: string;
  subjectAttendance?: Record<string, { attended: number; total: number; percentage: number }>;
  subjectScores?: Record<string, { marks: number; maxMarks: number; grade: string }>;
  placementStatus?: 'Placed' | 'Interviewing' | 'Eligible' | 'Ineligible' | 'Applied' | 'In Process' | 'Seeking';
  placementEligibility?: 'Eligible' | 'Not Eligible' | 'Conditionally Eligible';
  applicationStatus?: 'Applied' | 'Shortlisted' | 'Selected' | 'Rejected' | 'Not Applied';
  skills?: string[];
  company?: string;
  ctc?: string;
  driveDate?: string;
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  subject: string;
  faculty: string;
  totalPresent: number;
  totalStudents: number;
  entries: AttendanceEntry[];
}

export interface AcademicMarkEntry {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subject: string;
  assessmentType: 'Internal 1' | 'Internal 2' | 'Assignment' | 'Model Exam' | 'End Semester';
  marks: number;
  maxMarks: number;
  grade: string;
  date: string;
}

export interface StaffPlacementStudent {
  id: string;
  name: string;
  rollNumber: string;
  cgpa: number;
  skills: string[];
  eligibility: 'Eligible' | 'Not Eligible' | 'Conditionally Eligible';
  applicationStatus: 'Applied' | 'Shortlisted' | 'Selected' | 'Rejected' | 'Not Applied';
  placementStatus: 'Placed' | 'In Process' | 'Seeking' | 'Higher Studies';
  company?: string;
  ctc?: string;
  driveDate?: string;
}

export interface AIStudentSupportCase {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  attendance: number;
  academicScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  aiInsight: string;
  recommendedAction: string;
  staffRemarks?: string;
  intervention?: string;
  followUpDate?: string;
  supportStatus: 'Open' | 'In Progress' | 'Resolved' | 'Monitoring';
  lastUpdated?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  audience: 'All Students' | 'Computer Science' | 'AI & Data Science' | '3rd Year' | 'Final Year';
  date: string;
  author: string;
  category: 'General' | 'Exam' | 'Placement' | 'Attendance' | 'Event';
  pinned?: boolean;
}

export interface StaffReportSummary {
  id: string;
  title: string;
  category: 'Attendance' | 'Academics' | 'At-Risk' | 'Placement';
  generatedDate: string;
  recordCount: number;
  description: string;
  summaryMetrics: Record<string, string | number>;
}
