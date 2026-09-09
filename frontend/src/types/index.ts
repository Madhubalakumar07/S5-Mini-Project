// ─── Student ────────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  firstName: string;
  department: string;
  batch: string;
  rollNumber: string;
  cgpa: number;
  semesterGpa: number;
  email: string;
  phone: string;
  avatarInitials: string;
  onlineStatus: 'online' | 'away' | 'offline';
}

// ─── Attendance ─────────────────────────────────────────────────
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

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  status: 'present' | 'absent' | 'partial' | 'holiday' | 'future';
  classes?: ClassRecord[];
}

export interface ClassRecord {
  subject: string;
  time: string;
  status: 'Present' | 'Absent' | 'Partial';
  recognitionMethod: string;
}

// ─── Academics ──────────────────────────────────────────────────
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

export interface StudyPlanDay {
  day: string;
  subject: string;
  duration: number;
  completed: boolean;
  type: 'theory' | 'practice' | 'mock';
}

export interface ExamReadinessBreakdown {
  label: string;
  value: number;
}

// ─── Placement ──────────────────────────────────────────────────
export interface PlacementBreakdown {
  label: string;
  value: number;
  icon: string;
}

export interface CareerRoadmapStep {
  step: number;
  title: string;
  progress: number;
  completed: boolean;
  description: string;
}

export interface Company {
  name: string;
  logo: string;
  matchPercentage: number;
  skillsMatched: number;
  totalSkills: number;
  ctc: string;
  roles: string[];
  color: string;
}

export interface ResumeItem {
  label: string;
  completed: boolean;
}

export interface MockInterview {
  type: string;
  date: string;
  time: string;
  interviewer: string;
}

// ─── Coding ─────────────────────────────────────────────────────
export interface CodingPlatform {
  name: string;
  username: string;
  solved: number;
  monthlyGain: number;
  rating?: number;
  stars?: number;
  streak?: number;
  contributions?: number;
  repositories?: number;
  color: string;
  bgColor: string;
  url: string;
}

export interface CodingActivityMonth {
  month: string;
  problems: number;
}

// ─── Notifications ──────────────────────────────────────────────
export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info' | 'ai' | 'calendar';
  message: string;
  time: string;
  read: boolean;
}

// ─── General ────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

// ─── Staff Portal Types ──────────────────────────────────────────
export interface StaffProfile {
  id: string;
  name: string;
  staffId: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  office: string;
  avatarInitials: string;
  subjects: string[];
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
