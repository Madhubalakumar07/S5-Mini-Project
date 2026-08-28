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
