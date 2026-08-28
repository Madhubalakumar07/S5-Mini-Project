import type { Student } from '../types';

export const student: Student = {
  id: 'AK2026CS001',
  name: 'Arun Kumar',
  firstName: 'Arun',
  department: 'Computer Science',
  batch: '2026',
  rollNumber: '21CS001',
  cgpa: 8.4,
  semesterGpa: 8.7,
  email: 'arun.kumar@college.edu',
  phone: '+91 98765 43210',
  avatarInitials: 'AK',
  onlineStatus: 'online',
};

export const summaryStats = {
  attendance: {
    percentage: 92.4,
    monthChange: 2.1,
    classesAttended: 186,
    classesMissed: 15,
    streak: 12,
    label: 'Good Standing',
  },
  academics: {
    cgpa: 8.4,
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
};

export const upcomingEvents = [
  { date: 'Aug 09', event: 'DBMS Internal Assessment', type: 'exam', icon: '📝' },
  { date: 'Aug 11', event: 'Placement Aptitude Test', type: 'placement', icon: '💼' },
  { date: 'Aug 14', event: 'Resume Review', type: 'career', icon: '📄' },
  { date: 'Aug 18', event: 'Mock Interview', type: 'interview', icon: '🎯' },
];

export const notifications = [
  {
    id: '1',
    type: 'warning' as const,
    message: 'Computer Networks attendance below 75%',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'success' as const,
    message: 'DSA weekly goal completed! 🎉',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'calendar' as const,
    message: 'DBMS exam in 3 days — review scheduled',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'info' as const,
    message: 'Resume profile is 90% complete',
    time: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'ai' as const,
    message: 'New AI recommendation available for DSA',
    time: '3 days ago',
    read: true,
  },
];
