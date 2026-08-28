import type { AttendanceSubject, AttendanceTrend, CalendarDay } from '../types';

export const attendanceTrend: AttendanceTrend[] = [
  { week: 'Week 1', percentage: 88 },
  { week: 'Week 2', percentage: 85 },
  { week: 'Week 3', percentage: 91 },
  { week: 'Week 4', percentage: 89 },
  { week: 'Week 5', percentage: 94 },
  { week: 'Week 6', percentage: 90 },
  { week: 'Week 7', percentage: 96 },
  { week: 'Week 8', percentage: 92 },
];

export const subjectAttendance: AttendanceSubject[] = [
  {
    subject: 'Data Structures & Algorithms',
    faculty: 'Dr. Priya Sharma',
    attended: 32,
    total: 35,
    percentage: 91.4,
    status: 'Good',
  },
  {
    subject: 'Database Management Systems',
    faculty: 'Dr. Rajesh Kumar',
    attended: 28,
    total: 32,
    percentage: 87.5,
    status: 'Good',
  },
  {
    subject: 'Operating Systems',
    faculty: 'Dr. Arun Patel',
    attended: 24,
    total: 30,
    percentage: 80,
    status: 'Good',
  },
  {
    subject: 'Computer Networks',
    faculty: 'Dr. Ravi Chandran',
    attended: 21,
    total: 29,
    percentage: 72.4,
    status: 'At Risk',
  },
  {
    subject: 'Artificial Intelligence & ML',
    faculty: 'Dr. Meena Krishnan',
    attended: 30,
    total: 32,
    percentage: 93.8,
    status: 'Excellent',
  },
];

// Calendar for August 2026
export const calendarData: CalendarDay[] = [
  // Week 1
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
  { date: 6, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'DBMS', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'Operating Systems', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 7, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Operating Systems', time: '10:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'AI & ML', time: '2:00 PM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 8, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Data Structures', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'Computer Networks', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 9, month: 8, year: 2026, status: 'holiday' },
  { date: 10, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'DBMS', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 11, month: 8, year: 2026, status: 'partial', classes: [
    { subject: 'Operating Systems', time: '10:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'AI & ML', time: '2:00 PM', status: 'Absent', recognitionMethod: 'Manual Entry' },
  ]},
  { date: 12, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Data Structures', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'Computer Networks', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 13, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'DBMS', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'Operating Systems', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 14, month: 8, year: 2026, status: 'absent', classes: [
    { subject: 'AI & ML', time: '10:00 AM', status: 'Absent', recognitionMethod: 'Manual Entry' },
  ]},
  { date: 15, month: 8, year: 2026, status: 'holiday' },
  { date: 16, month: 8, year: 2026, status: 'holiday' },
  { date: 17, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Data Structures', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'Computer Networks', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 18, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'DBMS', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 19, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Operating Systems', time: '10:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'AI & ML', time: '2:00 PM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 20, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Data Structures', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'DBMS', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 21, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Computer Networks', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'AI & ML', time: '2:00 PM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 22, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Operating Systems', time: '10:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 23, month: 8, year: 2026, status: 'holiday' },
  { date: 24, month: 8, year: 2026, status: 'holiday' },
  { date: 25, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'Data Structures', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 26, month: 8, year: 2026, status: 'present', classes: [
    { subject: 'DBMS', time: '9:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
    { subject: 'Computer Networks', time: '11:00 AM', status: 'Present', recognitionMethod: 'Face Recognition' },
  ]},
  { date: 27, month: 8, year: 2026, status: 'future' },
  { date: 28, month: 8, year: 2026, status: 'future' },
  { date: 29, month: 8, year: 2026, status: 'future' },
  { date: 30, month: 8, year: 2026, status: 'future' },
  { date: 31, month: 8, year: 2026, status: 'future' },
];
