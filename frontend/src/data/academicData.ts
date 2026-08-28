import type { SubjectScore, PerformanceTrend, StudyPlanDay, ExamReadinessBreakdown } from '../types';

export const subjectScores: SubjectScore[] = [
  { subject: 'Data Structures', score: 88, maxScore: 100, trend: 'down' },
  { subject: 'DBMS', score: 82, maxScore: 100, trend: 'stable' },
  { subject: 'Operating Systems', score: 76, maxScore: 100, trend: 'down' },
  { subject: 'Computer Networks', score: 72, maxScore: 100, trend: 'down' },
  { subject: 'AI & ML', score: 91, maxScore: 100, trend: 'up' },
];

export const performanceTrend: PerformanceTrend[] = [
  { assessment: 'Internal 1', dataStructures: 82, dbms: 79, os: 74, cn: 70, aiml: 88 },
  { assessment: 'Internal 2', dataStructures: 85, dbms: 81, os: 72, cn: 68, aiml: 90 },
  { assessment: 'Assignment', dataStructures: 90, dbms: 85, os: 78, cn: 74, aiml: 92 },
  { assessment: 'Model Exam', dataStructures: 88, dbms: 82, os: 76, cn: 72, aiml: 91 },
];

export const weakSubjects = [
  {
    subject: 'Computer Networks',
    score: 72,
    status: 'Needs Improvement' as const,
    recommendation: 'Focus on Routing Algorithms, TCP/IP Protocol Stack, and Network Security fundamentals.',
    topics: ['Routing Algorithms', 'TCP/IP', 'Network Security', 'Subnetting'],
  },
  {
    subject: 'Operating Systems',
    score: 76,
    status: 'Needs Attention' as const,
    recommendation: 'Revise Process Scheduling algorithms, Deadlock detection, and Memory Management.',
    topics: ['Process Scheduling', 'Deadlocks', 'Memory Management', 'File Systems'],
  },
];

export const studyPlan: StudyPlanDay[] = [
  { day: 'MON', subject: 'Data Structures', duration: 45, completed: true, type: 'theory' },
  { day: 'TUE', subject: 'Operating Systems', duration: 40, completed: true, type: 'theory' },
  { day: 'WED', subject: 'Coding Practice', duration: 60, completed: false, type: 'practice' },
  { day: 'THU', subject: 'Computer Networks', duration: 45, completed: false, type: 'theory' },
  { day: 'FRI', subject: 'DBMS', duration: 40, completed: false, type: 'theory' },
  { day: 'SAT', subject: 'Mock Test', duration: 90, completed: false, type: 'mock' },
];

export const examReadinessBreakdown: ExamReadinessBreakdown[] = [
  { label: 'Attendance', value: 92 },
  { label: 'Internal Marks', value: 84 },
  { label: 'Practice Consistency', value: 76 },
  { label: 'Assignment Completion', value: 90 },
];

export const semesterHistory = [
  { semester: 'Sem 1', gpa: 7.8 },
  { semester: 'Sem 2', gpa: 8.1 },
  { semester: 'Sem 3', gpa: 8.0 },
  { semester: 'Sem 4', gpa: 8.3 },
  { semester: 'Sem 5', gpa: 8.7 },
];
