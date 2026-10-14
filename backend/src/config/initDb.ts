import { pool } from './db.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// ─── Full Demo Student Data ───────────────────────────────────────────────────
const DEMO_STUDENTS = [
  {
    name: 'Rahul Kumar',          email: 'rahul.kumar@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS045', year: 3, semester: 5, section: 'A', phone: '+91 98765 11001',
    cgpa: 6.8, riskLevel: 'High', attendance: 68, academicScore: 52,
    avatarInitials: 'RK', aiInsight: 'Low attendance in Computer Networks (62%) and declining internal assessment scores.',
    recommendedAction: 'Schedule a 1-on-1 mentoring session and issue statutory attendance notification.',
    skills: ['C', 'Python Basics', 'Git'], placementEligibility: 'Conditionally Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Not Applied', company: null, ctc: null, driveDate: null,
    subjectAttendance: { 'Data Structures': { attended: 22, total: 35, percentage: 62.8 }, 'DBMS': { attended: 24, total: 32, percentage: 75.0 }, 'Operating Systems': { attended: 20, total: 30, percentage: 66.7 }, 'Computer Networks': { attended: 18, total: 29, percentage: 62.1 }, 'AI & ML': { attended: 24, total: 32, percentage: 75.0 } },
    subjectScores: { 'Data Structures': { marks: 54, maxMarks: 100, grade: 'C' }, 'DBMS': { marks: 58, maxMarks: 100, grade: 'C' }, 'Operating Systems': { marks: 48, maxMarks: 100, grade: 'D' }, 'Computer Networks': { marks: 46, maxMarks: 100, grade: 'D' }, 'AI & ML': { marks: 56, maxMarks: 100, grade: 'C' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.2 }, { semester: 'Sem 2', gpa: 6.5 }, { semester: 'Sem 3', gpa: 6.7 }, { semester: 'Sem 4', gpa: 6.9 }, { semester: 'Sem 5', gpa: 6.8 }],
    codingSolved: 48, codingWeekSolved: 2, codingStreak: 3, placementScore: 42,
  },
  {
    name: 'Sneha Mohan',           email: 'sneha.mohan@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS082', year: 3, semester: 5, section: 'A', phone: '+91 98765 11002',
    cgpa: 7.1, riskLevel: 'High', attendance: 71, academicScore: 58,
    avatarInitials: 'SM', aiInsight: 'Frequent absences on Mondays/Fridays; sudden drop in Operating Systems internals.',
    recommendedAction: 'Assign remedial assignment practice and conduct conceptual review on OS.',
    skills: ['C', 'Java', 'Web Basics'], placementEligibility: 'Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Applied', company: 'TCS', ctc: null, driveDate: '2026-08-22',
    subjectAttendance: { 'Data Structures': { attended: 26, total: 35, percentage: 74.3 }, 'DBMS': { attended: 23, total: 32, percentage: 71.9 }, 'Operating Systems': { attended: 19, total: 30, percentage: 63.3 }, 'Computer Networks': { attended: 22, total: 29, percentage: 75.9 }, 'AI & ML': { attended: 22, total: 32, percentage: 68.8 } },
    subjectScores: { 'Data Structures': { marks: 62, maxMarks: 100, grade: 'B' }, 'DBMS': { marks: 60, maxMarks: 100, grade: 'B' }, 'Operating Systems': { marks: 51, maxMarks: 100, grade: 'C' }, 'Computer Networks': { marks: 58, maxMarks: 100, grade: 'C' }, 'AI & ML': { marks: 59, maxMarks: 100, grade: 'C' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.8 }, { semester: 'Sem 2', gpa: 7.0 }, { semester: 'Sem 3', gpa: 7.1 }, { semester: 'Sem 4', gpa: 7.2 }, { semester: 'Sem 5', gpa: 7.1 }],
    codingSolved: 75, codingWeekSolved: 4, codingStreak: 6, placementScore: 52,
  },
  {
    name: 'Karthik Raja',          email: 'karthik.raja@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS028', year: 3, semester: 5, section: 'A', phone: '+91 98765 11003',
    cgpa: 6.9, riskLevel: 'High', attendance: 64, academicScore: 55,
    avatarInitials: 'KR', aiInsight: 'Attendance below 65% statutory limit across 3 subjects; backlog risk in semester exams.',
    recommendedAction: 'Issue formal attendance warning notice and arrange parent counseling session.',
    skills: ['Python', 'Linux', 'Bash'], placementEligibility: 'Not Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Not Applied', company: null, ctc: null, driveDate: null,
    subjectAttendance: { 'Data Structures': { attended: 21, total: 35, percentage: 60.0 }, 'DBMS': { attended: 20, total: 32, percentage: 62.5 }, 'Operating Systems': { attended: 19, total: 30, percentage: 63.3 }, 'Computer Networks': { attended: 18, total: 29, percentage: 62.1 }, 'AI & ML': { attended: 23, total: 32, percentage: 71.9 } },
    subjectScores: { 'Data Structures': { marks: 52, maxMarks: 100, grade: 'D' }, 'DBMS': { marks: 56, maxMarks: 100, grade: 'C' }, 'Operating Systems': { marks: 55, maxMarks: 100, grade: 'C' }, 'Computer Networks': { marks: 50, maxMarks: 100, grade: 'D' }, 'AI & ML': { marks: 62, maxMarks: 100, grade: 'B' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.4 }, { semester: 'Sem 2', gpa: 6.6 }, { semester: 'Sem 3', gpa: 6.9 }, { semester: 'Sem 4', gpa: 7.0 }, { semester: 'Sem 5', gpa: 6.9 }],
    codingSolved: 32, codingWeekSolved: 1, codingStreak: 1, placementScore: 35,
  },
  {
    name: 'Vikram Sundaram',       email: 'vikram.sundaram@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS098', year: 3, semester: 5, section: 'A', phone: '+91 98765 11004',
    cgpa: 7.5, riskLevel: 'Medium', attendance: 76, academicScore: 68,
    avatarInitials: 'VS', aiInsight: 'Borderline attendance in Computer Networks; coding practice progress stalled.',
    recommendedAction: 'Encourage daily LeetCode practice and assign peer study buddy.',
    skills: ['JavaScript', 'MongoDB', 'Express', 'Node.js'], placementEligibility: 'Eligible',
    placementStatus: 'In Process', applicationStatus: 'Shortlisted', company: 'TCS', ctc: null, driveDate: '2026-08-15',
    subjectAttendance: { 'Data Structures': { attended: 28, total: 35, percentage: 80.0 }, 'DBMS': { attended: 25, total: 32, percentage: 78.1 }, 'Operating Systems': { attended: 23, total: 30, percentage: 76.7 }, 'Computer Networks': { attended: 21, total: 29, percentage: 72.4 }, 'AI & ML': { attended: 25, total: 32, percentage: 78.1 } },
    subjectScores: { 'Data Structures': { marks: 72, maxMarks: 100, grade: 'B+' }, 'DBMS': { marks: 70, maxMarks: 100, grade: 'B+' }, 'Operating Systems': { marks: 66, maxMarks: 100, grade: 'B' }, 'Computer Networks': { marks: 62, maxMarks: 100, grade: 'B' }, 'AI & ML': { marks: 70, maxMarks: 100, grade: 'B+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.0 }, { semester: 'Sem 2', gpa: 7.2 }, { semester: 'Sem 3', gpa: 7.4 }, { semester: 'Sem 4', gpa: 7.5 }, { semester: 'Sem 5', gpa: 7.5 }],
    codingSolved: 112, codingWeekSolved: 6, codingStreak: 9, placementScore: 61,
  },
  {
    name: 'Ananya Iyer',           email: 'ananya.iyer@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS012', year: 3, semester: 5, section: 'A', phone: '+91 98765 11005',
    cgpa: 7.8, riskLevel: 'Medium', attendance: 78, academicScore: 71,
    avatarInitials: 'AI', aiInsight: 'Strong theory marks but lagging in practical lab assessments and mock interviews.',
    recommendedAction: 'Provide mock technical interview slot and laboratory revision session.',
    skills: ['Python', 'SQL', 'Data Analytics', 'Tableau'], placementEligibility: 'Eligible',
    placementStatus: 'In Process', applicationStatus: 'Applied', company: 'Infosys', ctc: null, driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 29, total: 35, percentage: 82.9 }, 'DBMS': { attended: 25, total: 32, percentage: 78.1 }, 'Operating Systems': { attended: 22, total: 30, percentage: 73.3 }, 'Computer Networks': { attended: 23, total: 29, percentage: 79.3 }, 'AI & ML': { attended: 25, total: 32, percentage: 78.1 } },
    subjectScores: { 'Data Structures': { marks: 76, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 74, maxMarks: 100, grade: 'B+' }, 'Operating Systems': { marks: 68, maxMarks: 100, grade: 'B' }, 'Computer Networks': { marks: 65, maxMarks: 100, grade: 'B' }, 'AI & ML': { marks: 72, maxMarks: 100, grade: 'B+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.4 }, { semester: 'Sem 2', gpa: 7.6 }, { semester: 'Sem 3', gpa: 7.7 }, { semester: 'Sem 4', gpa: 7.8 }, { semester: 'Sem 5', gpa: 7.8 }],
    codingSolved: 134, codingWeekSolved: 7, codingStreak: 11, placementScore: 65,
  },
  {
    name: 'Arun Kumar',            email: 'arun.kumar@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS001', year: 3, semester: 5, section: 'A', phone: '+91 98765 43210',
    cgpa: 8.4, riskLevel: 'Low', attendance: 92, academicScore: 88,
    avatarInitials: 'AK', aiInsight: 'Consistent high attendance, excellent DSA capability, high placement probability.',
    recommendedAction: 'Recommend for Dream/Super-Dream company campus placement rounds.',
    skills: ['React', 'Node.js', 'Python', 'DSA', 'PostgreSQL'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 32, total: 35, percentage: 91.4 }, 'DBMS': { attended: 28, total: 32, percentage: 87.5 }, 'Operating Systems': { attended: 24, total: 30, percentage: 80.0 }, 'Computer Networks': { attended: 21, total: 29, percentage: 72.4 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 88, maxMarks: 100, grade: 'A+' }, 'DBMS': { marks: 82, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 76, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 72, maxMarks: 100, grade: 'B+' }, 'AI & ML': { marks: 91, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.8 }, { semester: 'Sem 2', gpa: 8.1 }, { semester: 'Sem 3', gpa: 8.0 }, { semester: 'Sem 4', gpa: 8.3 }, { semester: 'Sem 5', gpa: 8.7 }],
    codingSolved: 248, codingWeekSolved: 12, codingStreak: 18, placementScore: 78,
  },
  {
    name: 'Priya Sharma',          email: 'priya.sharma@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science', registerNumber: '21AD045', year: 3, semester: 5, section: 'A', phone: '+91 98123 45678',
    cgpa: 9.1, riskLevel: 'Low', attendance: 96, academicScore: 94,
    avatarInitials: 'PS', aiInsight: 'Top percentile performer across all assessments with published research paper.',
    recommendedAction: 'Nominate for academic merit scholarship and AI research fellowship.',
    skills: ['PyTorch', 'TensorFlow', 'Data Science', 'C++', 'Computer Vision'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 35, total: 35, percentage: 100.0 }, 'DBMS': { attended: 31, total: 32, percentage: 96.9 }, 'Operating Systems': { attended: 29, total: 30, percentage: 96.7 }, 'Computer Networks': { attended: 28, total: 29, percentage: 96.6 }, 'AI & ML': { attended: 32, total: 32, percentage: 100.0 } },
    subjectScores: { 'Data Structures': { marks: 96, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 92, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 90, maxMarks: 100, grade: 'O' }, 'Computer Networks': { marks: 88, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 98, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.8 }, { semester: 'Sem 2', gpa: 9.1 }, { semester: 'Sem 3', gpa: 9.0 }, { semester: 'Sem 4', gpa: 9.3 }, { semester: 'Sem 5', gpa: 9.1 }],
    codingSolved: 345, codingWeekSolved: 18, codingStreak: 30, placementScore: 96,
  },
  {
    name: 'Deepak Selvan',         email: 'deepak.selvan@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS022', year: 3, semester: 5, section: 'A', phone: '+91 98765 11008',
    cgpa: 8.2, riskLevel: 'Low', attendance: 88, academicScore: 84,
    avatarInitials: 'DS', aiInsight: 'Stable academic performance with strong database and web dev portfolio.',
    recommendedAction: 'Guide on full-stack architecture for capstone and placement interviews.',
    skills: ['Java', 'Spring Boot', 'SQL', 'AWS', 'Docker'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'TCS', ctc: '3.8 LPA', driveDate: '2026-07-20',
    subjectAttendance: { 'Data Structures': { attended: 31, total: 35, percentage: 88.6 }, 'DBMS': { attended: 29, total: 32, percentage: 90.6 }, 'Operating Systems': { attended: 26, total: 30, percentage: 86.7 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 28, total: 32, percentage: 87.5 } },
    subjectScores: { 'Data Structures': { marks: 84, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 89, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 80, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 78, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 85, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.6 }, { semester: 'Sem 2', gpa: 7.9 }, { semester: 'Sem 3', gpa: 8.1 }, { semester: 'Sem 4', gpa: 8.2 }, { semester: 'Sem 5', gpa: 8.2 }],
    codingSolved: 210, codingWeekSolved: 10, codingStreak: 14, placementScore: 74,
  },
  {
    name: 'Meera Nambiar',         email: 'meera.nambiar@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS061', year: 3, semester: 5, section: 'A', phone: '+91 98765 11009',
    cgpa: 8.5, riskLevel: 'Low', attendance: 90, academicScore: 86,
    avatarInitials: 'MN', aiInsight: 'Consistently ranks in top 10%; exceptional problem-solving speed in algorithmic tests.',
    recommendedAction: 'Direct toward national hackathons and competitive programming contests.',
    skills: ['C++', 'Competitive Programming', 'Algorithms', 'Go'], placementEligibility: 'Eligible',
    placementStatus: 'In Process', applicationStatus: 'Shortlisted', company: 'Zoho', ctc: null, driveDate: '2026-08-12',
    subjectAttendance: { 'Data Structures': { attended: 33, total: 35, percentage: 94.3 }, 'DBMS': { attended: 29, total: 32, percentage: 90.6 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 26, total: 29, percentage: 89.7 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 90, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 85, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 82, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 84, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 89, maxMarks: 100, grade: 'A+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.0 }, { semester: 'Sem 2', gpa: 8.3 }, { semester: 'Sem 3', gpa: 8.4 }, { semester: 'Sem 4', gpa: 8.5 }, { semester: 'Sem 5', gpa: 8.5 }],
    codingSolved: 280, codingWeekSolved: 14, codingStreak: 22, placementScore: 82,
  },
  {
    name: 'Harish Varma',          email: 'harish.varma@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS034', year: 3, semester: 5, section: 'A', phone: '+91 98765 11010',
    cgpa: 7.2, riskLevel: 'Medium', attendance: 74, academicScore: 66,
    avatarInitials: 'HV', aiInsight: 'Attendance dipped below 75% recently; average performance in technical internals.',
    recommendedAction: 'Issue reminder on attendance threshold and provide practice tests.',
    skills: ['Java', 'HTML/CSS', 'MySQL', 'Git'], placementEligibility: 'Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Applied', company: 'Infosys', ctc: null, driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 26, total: 35, percentage: 74.3 }, 'DBMS': { attended: 24, total: 32, percentage: 75.0 }, 'Operating Systems': { attended: 21, total: 30, percentage: 70.0 }, 'Computer Networks': { attended: 22, total: 29, percentage: 75.9 }, 'AI & ML': { attended: 24, total: 32, percentage: 75.0 } },
    subjectScores: { 'Data Structures': { marks: 68, maxMarks: 100, grade: 'B' }, 'DBMS': { marks: 66, maxMarks: 100, grade: 'B' }, 'Operating Systems': { marks: 64, maxMarks: 100, grade: 'B' }, 'Computer Networks': { marks: 60, maxMarks: 100, grade: 'B' }, 'AI & ML': { marks: 72, maxMarks: 100, grade: 'B+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.8 }, { semester: 'Sem 2', gpa: 7.0 }, { semester: 'Sem 3', gpa: 7.1 }, { semester: 'Sem 4', gpa: 7.2 }, { semester: 'Sem 5', gpa: 7.2 }],
    codingSolved: 90, codingWeekSolved: 4, codingStreak: 5, placementScore: 56,
  },
  {
    name: 'Divya Bharathi',        email: 'divya.bharathi@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS019', year: 3, semester: 5, section: 'A', phone: '+91 98765 11011',
    cgpa: 8.7, riskLevel: 'Low', attendance: 94, academicScore: 89,
    avatarInitials: 'DB', aiInsight: 'Excellent consistency in database design and cloud microservices projects.',
    recommendedAction: 'Nominate for Cloud Practitioner AWS certification sponsorship.',
    skills: ['Java', 'Spring Cloud', 'PostgreSQL', 'Docker', 'Kubernetes'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 33, total: 35, percentage: 94.3 }, 'DBMS': { attended: 31, total: 32, percentage: 96.9 }, 'Operating Systems': { attended: 28, total: 30, percentage: 93.3 }, 'Computer Networks': { attended: 27, total: 29, percentage: 93.1 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 91, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 94, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 85, maxMarks: 100, grade: 'A+' }, 'Computer Networks': { marks: 86, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 90, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.2 }, { semester: 'Sem 2', gpa: 8.5 }, { semester: 'Sem 3', gpa: 8.6 }, { semester: 'Sem 4', gpa: 8.8 }, { semester: 'Sem 5', gpa: 8.7 }],
    codingSolved: 295, codingWeekSolved: 15, codingStreak: 25, placementScore: 88,
  },
  {
    name: 'Gowtham R',             email: 'gowtham.r@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS031', year: 3, semester: 5, section: 'A', phone: '+91 98765 11012',
    cgpa: 8.0, riskLevel: 'Low', attendance: 87, academicScore: 81,
    avatarInitials: 'GR', aiInsight: 'Solid algorithmic foundations and proactive participation in technical webinars.',
    recommendedAction: 'Prepare for product-based company interview architecture rounds.',
    skills: ['Python', 'Django', 'React', 'Redis', 'REST APIs'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 30, total: 35, percentage: 85.7 }, 'DBMS': { attended: 28, total: 32, percentage: 87.5 }, 'Operating Systems': { attended: 26, total: 30, percentage: 86.7 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 28, total: 32, percentage: 87.5 } },
    subjectScores: { 'Data Structures': { marks: 82, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 80, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 78, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 80, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 85, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.5 }, { semester: 'Sem 2', gpa: 7.8 }, { semester: 'Sem 3', gpa: 7.9 }, { semester: 'Sem 4', gpa: 8.0 }, { semester: 'Sem 5', gpa: 8.0 }],
    codingSolved: 195, codingWeekSolved: 9, codingStreak: 13, placementScore: 72,
  },
  {
    name: 'Kavitha S',             email: 'kavitha.s@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS048', year: 3, semester: 5, section: 'A', phone: '+91 98765 11013',
    cgpa: 8.3, riskLevel: 'Low', attendance: 89, academicScore: 83,
    avatarInitials: 'KS', aiInsight: 'High quality software engineering deliverables with clean code habits.',
    recommendedAction: 'Encourage contribution to open-source student repositories.',
    skills: ['Flutter', 'Dart', 'Firebase', 'Java', 'UI/UX'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'TCS', ctc: '3.8 LPA', driveDate: '2026-07-20',
    subjectAttendance: { 'Data Structures': { attended: 31, total: 35, percentage: 88.6 }, 'DBMS': { attended: 29, total: 32, percentage: 90.6 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 29, total: 32, percentage: 90.6 } },
    subjectScores: { 'Data Structures': { marks: 85, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 86, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 81, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 80, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 84, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.8 }, { semester: 'Sem 2', gpa: 8.1 }, { semester: 'Sem 3', gpa: 8.2 }, { semester: 'Sem 4', gpa: 8.3 }, { semester: 'Sem 5', gpa: 8.3 }],
    codingSolved: 220, codingWeekSolved: 11, codingStreak: 16, placementScore: 76,
  },
  {
    name: 'Manoj Kumar',           email: 'manoj.kumar@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS054', year: 3, semester: 5, section: 'A', phone: '+91 98765 11014',
    cgpa: 7.7, riskLevel: 'Low', attendance: 82, academicScore: 75,
    avatarInitials: 'MK', aiInsight: 'Steady academic progression with interest in DevOps and infrastructure.',
    recommendedAction: 'Assign cloud deployment tasks in lab group projects.',
    skills: ['Linux', 'Docker', 'Python', 'Networking', 'CI/CD'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Infosys', ctc: '4.5 LPA', driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 29, total: 35, percentage: 82.9 }, 'DBMS': { attended: 26, total: 32, percentage: 81.3 }, 'Operating Systems': { attended: 25, total: 30, percentage: 83.3 }, 'Computer Networks': { attended: 24, total: 29, percentage: 82.8 }, 'AI & ML': { attended: 26, total: 32, percentage: 81.3 } },
    subjectScores: { 'Data Structures': { marks: 76, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 74, maxMarks: 100, grade: 'B+' }, 'Operating Systems': { marks: 75, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 72, maxMarks: 100, grade: 'B+' }, 'AI & ML': { marks: 78, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.2 }, { semester: 'Sem 2', gpa: 7.4 }, { semester: 'Sem 3', gpa: 7.6 }, { semester: 'Sem 4', gpa: 7.7 }, { semester: 'Sem 5', gpa: 7.7 }],
    codingSolved: 155, codingWeekSolved: 7, codingStreak: 10, placementScore: 67,
  },
  {
    name: 'Nithya Sri',            email: 'nithya.sri@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS067', year: 3, semester: 5, section: 'A', phone: '+91 98765 11015',
    cgpa: 8.6, riskLevel: 'Low', attendance: 91, academicScore: 87,
    avatarInitials: 'NS', aiInsight: 'Outstanding grasp of machine learning workflows and database optimization.',
    recommendedAction: 'Encourage submitting research abstract to student conference.',
    skills: ['Python', 'Scikit-Learn', 'FastAPI', 'SQL', 'Deep Learning'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 32, total: 35, percentage: 91.4 }, 'DBMS': { attended: 30, total: 32, percentage: 93.8 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 26, total: 29, percentage: 89.7 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 88, maxMarks: 100, grade: 'A+' }, 'DBMS': { marks: 90, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 84, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 82, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 92, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.1 }, { semester: 'Sem 2', gpa: 8.4 }, { semester: 'Sem 3', gpa: 8.5 }, { semester: 'Sem 4', gpa: 8.6 }, { semester: 'Sem 5', gpa: 8.6 }],
    codingSolved: 270, codingWeekSolved: 13, codingStreak: 20, placementScore: 85,
  },
  {
    name: 'Praveen Balaji',        email: 'praveen.balaji@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS075', year: 3, semester: 5, section: 'A', phone: '+91 98765 11016',
    cgpa: 7.9, riskLevel: 'Low', attendance: 85, academicScore: 79,
    avatarInitials: 'PB', aiInsight: 'Good analytical capability; performs well in continuous internal assessments.',
    recommendedAction: 'Engage in group system design exercises.',
    skills: ['React', 'JavaScript', 'Node.js', 'MySQL'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'TCS', ctc: '3.8 LPA', driveDate: '2026-07-20',
    subjectAttendance: { 'Data Structures': { attended: 30, total: 35, percentage: 85.7 }, 'DBMS': { attended: 27, total: 32, percentage: 84.4 }, 'Operating Systems': { attended: 25, total: 30, percentage: 83.3 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 27, total: 32, percentage: 84.4 } },
    subjectScores: { 'Data Structures': { marks: 80, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 81, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 76, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 75, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 82, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.4 }, { semester: 'Sem 2', gpa: 7.7 }, { semester: 'Sem 3', gpa: 7.8 }, { semester: 'Sem 4', gpa: 7.9 }, { semester: 'Sem 5', gpa: 7.9 }],
    codingSolved: 175, codingWeekSolved: 8, codingStreak: 12, placementScore: 70,
  },
  {
    name: 'Rithanya M',            email: 'rithanya.m@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS088', year: 3, semester: 5, section: 'A', phone: '+91 98765 11017',
    cgpa: 8.9, riskLevel: 'Low', attendance: 93, academicScore: 90,
    avatarInitials: 'RM', aiInsight: 'Ranked in top 5; demonstrates stellar problem breakdown and algorithm optimization.',
    recommendedAction: 'Guide toward high-tier product engineering interviews and hackathons.',
    skills: ['C++', 'Python', 'DSA', 'Next.js', 'System Design'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 33, total: 35, percentage: 94.3 }, 'DBMS': { attended: 30, total: 32, percentage: 93.8 }, 'Operating Systems': { attended: 28, total: 30, percentage: 93.3 }, 'Computer Networks': { attended: 27, total: 29, percentage: 93.1 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 93, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 91, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 88, maxMarks: 100, grade: 'A+' }, 'Computer Networks': { marks: 87, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 92, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.4 }, { semester: 'Sem 2', gpa: 8.7 }, { semester: 'Sem 3', gpa: 8.8 }, { semester: 'Sem 4', gpa: 9.0 }, { semester: 'Sem 5', gpa: 8.9 }],
    codingSolved: 318, codingWeekSolved: 16, codingStreak: 28, placementScore: 91,
  },
  {
    name: 'Santhosh Nathan',       email: 'santhosh.nathan@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS094', year: 3, semester: 5, section: 'A', phone: '+91 98765 11018',
    cgpa: 7.8, riskLevel: 'Low', attendance: 84, academicScore: 77,
    avatarInitials: 'SN', aiInsight: 'Reliable team player with sound backend engineering and API design skills.',
    recommendedAction: 'Provide advanced mock technical interviews on distributed caching.',
    skills: ['Golang', 'Docker', 'PostgreSQL', 'REST', 'Linux'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Infosys', ctc: '4.5 LPA', driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 29, total: 35, percentage: 82.9 }, 'DBMS': { attended: 27, total: 32, percentage: 84.4 }, 'Operating Systems': { attended: 25, total: 30, percentage: 83.3 }, 'Computer Networks': { attended: 24, total: 29, percentage: 82.8 }, 'AI & ML': { attended: 27, total: 32, percentage: 84.4 } },
    subjectScores: { 'Data Structures': { marks: 78, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 82, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 74, maxMarks: 100, grade: 'B+' }, 'Computer Networks': { marks: 73, maxMarks: 100, grade: 'B+' }, 'AI & ML': { marks: 80, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.3 }, { semester: 'Sem 2', gpa: 7.6 }, { semester: 'Sem 3', gpa: 7.7 }, { semester: 'Sem 4', gpa: 7.8 }, { semester: 'Sem 5', gpa: 7.8 }],
    codingSolved: 168, codingWeekSolved: 8, codingStreak: 11, placementScore: 69,
  },
  {
    name: 'Tharun V',              email: 'tharun.v@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS102', year: 3, semester: 5, section: 'A', phone: '+91 98765 11019',
    cgpa: 8.1, riskLevel: 'Low', attendance: 86, academicScore: 82,
    avatarInitials: 'TV', aiInsight: 'Strong proficiency in React front-ends and modern CSS architecture.',
    recommendedAction: 'Direct toward UI architecture roles in upcoming placement drives.',
    skills: ['TypeScript', 'React', 'Tailwind', 'Redux', 'GraphQL'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 30, total: 35, percentage: 85.7 }, 'DBMS': { attended: 28, total: 32, percentage: 87.5 }, 'Operating Systems': { attended: 26, total: 30, percentage: 86.7 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 27, total: 32, percentage: 84.4 } },
    subjectScores: { 'Data Structures': { marks: 82, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 84, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 79, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 81, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 85, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.6 }, { semester: 'Sem 2', gpa: 7.9 }, { semester: 'Sem 3', gpa: 8.0 }, { semester: 'Sem 4', gpa: 8.1 }, { semester: 'Sem 5', gpa: 8.1 }],
    codingSolved: 200, codingWeekSolved: 10, codingStreak: 14, placementScore: 73,
  },
  {
    name: 'Yogeshwaran K',         email: 'yogeshwaran.k@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS110', year: 3, semester: 5, section: 'A', phone: '+91 98765 11020',
    cgpa: 8.4, riskLevel: 'Low', attendance: 90, academicScore: 85,
    avatarInitials: 'YK', aiInsight: 'Well-rounded academic scores with commendable laboratory performance.',
    recommendedAction: 'Encourage participating in coding sprint competitions.',
    skills: ['Python', 'Django', 'PostgreSQL', 'Machine Learning', 'Git'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 32, total: 35, percentage: 91.4 }, 'DBMS': { attended: 29, total: 32, percentage: 90.6 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 26, total: 29, percentage: 89.7 }, 'AI & ML': { attended: 29, total: 32, percentage: 90.6 } },
    subjectScores: { 'Data Structures': { marks: 86, maxMarks: 100, grade: 'A+' }, 'DBMS': { marks: 85, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 82, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 83, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 88, maxMarks: 100, grade: 'A+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.9 }, { semester: 'Sem 2', gpa: 8.2 }, { semester: 'Sem 3', gpa: 8.3 }, { semester: 'Sem 4', gpa: 8.4 }, { semester: 'Sem 5', gpa: 8.4 }],
    codingSolved: 235, codingWeekSolved: 11, codingStreak: 17, placementScore: 80,
  },
  // Extra students from initDb only
  {
    name: 'Rahul Verma',           email: 'rahul.verma@bitsathy.ac.in',
    department: 'Electronics & Communication', registerNumber: '20EC089', year: 4, semester: 7, section: 'B', phone: '+91 98456 78901',
    cgpa: 8.2, riskLevel: 'Low', attendance: 85, academicScore: 80,
    avatarInitials: 'RV', aiInsight: 'Strong in signal processing and embedded systems.',
    recommendedAction: 'Encourage applying for core electronics roles.',
    skills: ['Embedded C', 'MATLAB', 'Python', 'VLSI'], placementEligibility: 'Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Not Applied', company: null, ctc: null, driveDate: null,
    subjectAttendance: { 'Digital Signal Processing': { attended: 28, total: 35, percentage: 80.0 }, 'VLSI Design': { attended: 25, total: 30, percentage: 83.3 }, 'Microprocessors': { attended: 26, total: 32, percentage: 81.3 }, 'Control Systems': { attended: 22, total: 28, percentage: 78.6 }, 'Communication Theory': { attended: 24, total: 30, percentage: 80.0 } },
    subjectScores: { 'Digital Signal Processing': { marks: 80, maxMarks: 100, grade: 'A' }, 'VLSI Design': { marks: 82, maxMarks: 100, grade: 'A' }, 'Microprocessors': { marks: 79, maxMarks: 100, grade: 'A' }, 'Control Systems': { marks: 78, maxMarks: 100, grade: 'A' }, 'Communication Theory': { marks: 81, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.6 }, { semester: 'Sem 2', gpa: 7.9 }, { semester: 'Sem 3', gpa: 8.0 }, { semester: 'Sem 4', gpa: 8.2 }, { semester: 'Sem 5', gpa: 8.3 }, { semester: 'Sem 6', gpa: 8.2 }, { semester: 'Sem 7', gpa: 8.2 }],
    codingSolved: 125, codingWeekSolved: 6, codingStreak: 8, placementScore: 68,
  },
  {
    name: 'Bala Murugan',          email: 'bala.m@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS002', year: 3, semester: 5, section: 'B', phone: '+91 98765 11111',
    cgpa: 7.6, riskLevel: 'Low', attendance: 80, academicScore: 73,
    avatarInitials: 'BM', aiInsight: 'Consistent attendance and steady academic performance.',
    recommendedAction: 'Encourage participating in inter-college technical events.',
    skills: ['Java', 'Python', 'MySQL', 'HTML/CSS'], placementEligibility: 'Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Applied', company: 'TCS', ctc: null, driveDate: '2026-08-22',
    subjectAttendance: { 'Data Structures': { attended: 28, total: 35, percentage: 80.0 }, 'DBMS': { attended: 26, total: 32, percentage: 81.3 }, 'Operating Systems': { attended: 24, total: 30, percentage: 80.0 }, 'Computer Networks': { attended: 23, total: 29, percentage: 79.3 }, 'AI & ML': { attended: 26, total: 32, percentage: 81.3 } },
    subjectScores: { 'Data Structures': { marks: 74, maxMarks: 100, grade: 'B+' }, 'DBMS': { marks: 76, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 72, maxMarks: 100, grade: 'B+' }, 'Computer Networks': { marks: 70, maxMarks: 100, grade: 'B+' }, 'AI & ML': { marks: 73, maxMarks: 100, grade: 'B+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.1 }, { semester: 'Sem 2', gpa: 7.4 }, { semester: 'Sem 3', gpa: 7.5 }, { semester: 'Sem 4', gpa: 7.6 }, { semester: 'Sem 5', gpa: 7.6 }],
    codingSolved: 145, codingWeekSolved: 7, codingStreak: 9, placementScore: 63,
  },
  // ─── 20 Additional Students (Entirely in DB) ──────────────────────────────────
  {
    name: 'Aravind Swaminathan',   email: 'aravind.swaminathan@bitsathy.ac.in',
    department: 'Information Technology', registerNumber: '21IT005', year: 3, semester: 5, section: 'A', phone: '+91 98765 22001',
    cgpa: 8.65, riskLevel: 'Low', attendance: 91, academicScore: 85,
    avatarInitials: 'AS', aiInsight: 'Strong full-stack capabilities with production-grade Django and PostgreSQL projects.',
    recommendedAction: 'Direct toward cloud architecture and backend engineering placement roles.',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 32, total: 35, percentage: 91.4 }, 'DBMS': { attended: 30, total: 32, percentage: 93.8 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 26, total: 29, percentage: 89.7 }, 'AI & ML': { attended: 29, total: 32, percentage: 90.6 } },
    subjectScores: { 'Data Structures': { marks: 88, maxMarks: 100, grade: 'A+' }, 'DBMS': { marks: 86, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 84, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 82, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 87, maxMarks: 100, grade: 'A+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.2 }, { semester: 'Sem 2', gpa: 8.5 }, { semester: 'Sem 3', gpa: 8.6 }, { semester: 'Sem 4', gpa: 8.8 }, { semester: 'Sem 5', gpa: 8.7 }],
    codingSolved: 265, codingWeekSolved: 13, codingStreak: 19, placementScore: 84,
  },
  {
    name: 'Bhavana Nair',          email: 'bhavana.nair@bitsathy.ac.in',
    department: 'Information Technology', registerNumber: '21IT014', year: 3, semester: 5, section: 'A', phone: '+91 98765 22002',
    cgpa: 9.25, riskLevel: 'Low', attendance: 96, academicScore: 92,
    avatarInitials: 'BN', aiInsight: 'Top percentile student with exceptional React & TypeScript portfolio and open-source contributions.',
    recommendedAction: 'Nominate for Super-Dream front-end role interviews.',
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 34, total: 35, percentage: 97.1 }, 'DBMS': { attended: 31, total: 32, percentage: 96.9 }, 'Operating Systems': { attended: 29, total: 30, percentage: 96.7 }, 'Computer Networks': { attended: 28, total: 29, percentage: 96.6 }, 'AI & ML': { attended: 31, total: 32, percentage: 96.9 } },
    subjectScores: { 'Data Structures': { marks: 95, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 92, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 91, maxMarks: 100, grade: 'O' }, 'Computer Networks': { marks: 90, maxMarks: 100, grade: 'O' }, 'AI & ML': { marks: 94, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 9.0 }, { semester: 'Sem 2', gpa: 9.2 }, { semester: 'Sem 3', gpa: 9.3 }, { semester: 'Sem 4', gpa: 9.4 }, { semester: 'Sem 5', gpa: 9.3 }],
    codingSolved: 310, codingWeekSolved: 16, codingStreak: 26, placementScore: 92,
  },
  {
    name: 'Chethan Ramesh',        email: 'chethan.ramesh@bitsathy.ac.in',
    department: 'Information Technology', registerNumber: '21IT023', year: 3, semester: 5, section: 'A', phone: '+91 98765 22003',
    cgpa: 7.15, riskLevel: 'High', attendance: 71, academicScore: 62,
    avatarInitials: 'CR', aiInsight: 'Attendance dip in Computer Networks (62%) and needs reinforcement in SQL queries.',
    recommendedAction: 'Assign peer mentor for SQL lab and monitor weekly attendance.',
    skills: ['Java', 'SQL', 'HTML/CSS', 'Git'], placementEligibility: 'Conditionally Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Applied', company: 'Infosys', ctc: null, driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 25, total: 35, percentage: 71.4 }, 'DBMS': { attended: 23, total: 32, percentage: 71.9 }, 'Operating Systems': { attended: 21, total: 30, percentage: 70.0 }, 'Computer Networks': { attended: 19, total: 29, percentage: 65.5 }, 'AI & ML': { attended: 23, total: 32, percentage: 71.9 } },
    subjectScores: { 'Data Structures': { marks: 65, maxMarks: 100, grade: 'B' }, 'DBMS': { marks: 62, maxMarks: 100, grade: 'B' }, 'Operating Systems': { marks: 60, maxMarks: 100, grade: 'B' }, 'Computer Networks': { marks: 56, maxMarks: 100, grade: 'C' }, 'AI & ML': { marks: 68, maxMarks: 100, grade: 'B' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.8 }, { semester: 'Sem 2', gpa: 7.0 }, { semester: 'Sem 3', gpa: 7.1 }, { semester: 'Sem 4', gpa: 7.3 }, { semester: 'Sem 5', gpa: 7.2 }],
    codingSolved: 85, codingWeekSolved: 4, codingStreak: 4, placementScore: 54,
  },
  {
    name: 'Dharshini Prakash',     email: 'dharshini.prakash@bitsathy.ac.in',
    department: 'Information Technology', registerNumber: '21IT032', year: 3, semester: 5, section: 'A', phone: '+91 98765 22004',
    cgpa: 7.90, riskLevel: 'Low', attendance: 83, academicScore: 78,
    avatarInitials: 'DP', aiInsight: 'Skilled in Flutter mobile cross-platform apps and RESTful API integration.',
    recommendedAction: 'Guide on mobile testing and App Store deployment pipelines.',
    skills: ['Flutter', 'Firebase', 'Dart', 'Mobile Dev', 'REST'], placementEligibility: 'Eligible',
    placementStatus: 'In Process', applicationStatus: 'Shortlisted', company: 'TCS', ctc: null, driveDate: '2026-08-15',
    subjectAttendance: { 'Data Structures': { attended: 29, total: 35, percentage: 82.9 }, 'DBMS': { attended: 27, total: 32, percentage: 84.4 }, 'Operating Systems': { attended: 25, total: 30, percentage: 83.3 }, 'Computer Networks': { attended: 24, total: 29, percentage: 82.8 }, 'AI & ML': { attended: 27, total: 32, percentage: 84.4 } },
    subjectScores: { 'Data Structures': { marks: 78, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 80, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 75, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 74, maxMarks: 100, grade: 'B+' }, 'AI & ML': { marks: 82, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.4 }, { semester: 'Sem 2', gpa: 7.7 }, { semester: 'Sem 3', gpa: 7.8 }, { semester: 'Sem 4', gpa: 8.0 }, { semester: 'Sem 5', gpa: 7.9 }],
    codingSolved: 170, codingWeekSolved: 8, codingStreak: 11, placementScore: 71,
  },
  {
    name: 'Ezhil Vendhan',         email: 'ezhil.vendhan@bitsathy.ac.in',
    department: 'Information Technology', registerNumber: '21IT041', year: 3, semester: 5, section: 'A', phone: '+91 98765 22005',
    cgpa: 8.35, riskLevel: 'Low', attendance: 88, academicScore: 81,
    avatarInitials: 'EV', aiInsight: 'Good grasp of Golang microservices and containerized application deployments.',
    recommendedAction: 'Direct toward cloud-native and platform engineering tracks.',
    skills: ['Go', 'Kubernetes', 'Linux', 'Microservices', 'Git'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'TCS', ctc: '3.8 LPA', driveDate: '2026-07-20',
    subjectAttendance: { 'Data Structures': { attended: 31, total: 35, percentage: 88.6 }, 'DBMS': { attended: 28, total: 32, percentage: 87.5 }, 'Operating Systems': { attended: 26, total: 30, percentage: 86.7 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 28, total: 32, percentage: 87.5 } },
    subjectScores: { 'Data Structures': { marks: 82, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 84, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 80, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 78, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 83, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.8 }, { semester: 'Sem 2', gpa: 8.1 }, { semester: 'Sem 3', gpa: 8.3 }, { semester: 'Sem 4', gpa: 8.4 }, { semester: 'Sem 5', gpa: 8.4 }],
    codingSolved: 225, codingWeekSolved: 11, codingStreak: 15, placementScore: 79,
  },
  {
    name: 'Farhana Yasmin',        email: 'farhana.yasmin@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science', registerNumber: '21AD008', year: 3, semester: 5, section: 'B', phone: '+91 98765 22006',
    cgpa: 8.95, riskLevel: 'Low', attendance: 94, academicScore: 89,
    avatarInitials: 'FY', aiInsight: 'Excellent natural language processing and transformer models comprehension.',
    recommendedAction: 'Sponsor participation in premier GenAI research hackathon.',
    skills: ['Python', 'TensorFlow', 'NLP', 'PyTorch', 'Data Science'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 33, total: 35, percentage: 94.3 }, 'DBMS': { attended: 30, total: 32, percentage: 93.8 }, 'Operating Systems': { attended: 28, total: 30, percentage: 93.3 }, 'Computer Networks': { attended: 27, total: 29, percentage: 93.1 }, 'AI & ML': { attended: 31, total: 32, percentage: 96.9 } },
    subjectScores: { 'Data Structures': { marks: 90, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 92, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 87, maxMarks: 100, grade: 'A+' }, 'Computer Networks': { marks: 86, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 95, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.5 }, { semester: 'Sem 2', gpa: 8.8 }, { semester: 'Sem 3', gpa: 8.9 }, { semester: 'Sem 4', gpa: 9.1 }, { semester: 'Sem 5', gpa: 9.0 }],
    codingSolved: 285, codingWeekSolved: 14, codingStreak: 21, placementScore: 88,
  },
  {
    name: 'Girish Madhav',         email: 'girish.madhav@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science', registerNumber: '21AD019', year: 3, semester: 5, section: 'B', phone: '+91 98765 22007',
    cgpa: 7.40, riskLevel: 'Medium', attendance: 74, academicScore: 69,
    avatarInitials: 'GM', aiInsight: 'Moderate data manipulation skills; requires coaching in algorithms and complexity.',
    recommendedAction: 'Schedule weekly problem-solving practice sessions.',
    skills: ['Python', 'Pandas', 'Scikit-Learn', 'SQL'], placementEligibility: 'Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Applied', company: 'Infosys', ctc: null, driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 26, total: 35, percentage: 74.3 }, 'DBMS': { attended: 24, total: 32, percentage: 75.0 }, 'Operating Systems': { attended: 22, total: 30, percentage: 73.3 }, 'Computer Networks': { attended: 21, total: 29, percentage: 72.4 }, 'AI & ML': { attended: 24, total: 32, percentage: 75.0 } },
    subjectScores: { 'Data Structures': { marks: 70, maxMarks: 100, grade: 'B+' }, 'DBMS': { marks: 72, maxMarks: 100, grade: 'B+' }, 'Operating Systems': { marks: 66, maxMarks: 100, grade: 'B' }, 'Computer Networks': { marks: 64, maxMarks: 100, grade: 'B' }, 'AI & ML': { marks: 74, maxMarks: 100, grade: 'B+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.0 }, { semester: 'Sem 2', gpa: 7.2 }, { semester: 'Sem 3', gpa: 7.3 }, { semester: 'Sem 4', gpa: 7.5 }, { semester: 'Sem 5', gpa: 7.4 }],
    codingSolved: 120, codingWeekSolved: 5, codingStreak: 7, placementScore: 60,
  },
  {
    name: 'Harini Venkat',         email: 'harini.venkat@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science', registerNumber: '21AD027', year: 3, semester: 5, section: 'B', phone: '+91 98765 22008',
    cgpa: 8.80, riskLevel: 'Low', attendance: 93, academicScore: 87,
    avatarInitials: 'HV', aiInsight: 'High proficiency in computer vision and real-time object tracking algorithms.',
    recommendedAction: 'Direct toward AI computer vision engineering roles.',
    skills: ['Computer Vision', 'OpenCV', 'Deep Learning', 'Python', 'Flask'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 33, total: 35, percentage: 94.3 }, 'DBMS': { attended: 30, total: 32, percentage: 93.8 }, 'Operating Systems': { attended: 28, total: 30, percentage: 93.3 }, 'Computer Networks': { attended: 26, total: 29, percentage: 89.7 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 88, maxMarks: 100, grade: 'A+' }, 'DBMS': { marks: 89, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 83, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 82, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 92, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.3 }, { semester: 'Sem 2', gpa: 8.6 }, { semester: 'Sem 3', gpa: 8.7 }, { semester: 'Sem 4', gpa: 8.9 }, { semester: 'Sem 5', gpa: 8.8 }],
    codingSolved: 260, codingWeekSolved: 13, codingStreak: 18, placementScore: 83,
  },
  {
    name: 'Indrajith Balan',       email: 'indrajith.balan@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science', registerNumber: '21AD036', year: 3, semester: 5, section: 'B', phone: '+91 98765 22009',
    cgpa: 6.95, riskLevel: 'High', attendance: 67, academicScore: 56,
    avatarInitials: 'IB', aiInsight: 'Low attendance in operating systems (60%) and backlog risk in end semester exams.',
    recommendedAction: 'Mandatory remedial lectures and attendance parent meeting.',
    skills: ['C++', 'Python Basics', 'Linux'], placementEligibility: 'Not Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Not Applied', company: null, ctc: null, driveDate: null,
    subjectAttendance: { 'Data Structures': { attended: 23, total: 35, percentage: 65.7 }, 'DBMS': { attended: 22, total: 32, percentage: 68.8 }, 'Operating Systems': { attended: 18, total: 30, percentage: 60.0 }, 'Computer Networks': { attended: 19, total: 29, percentage: 65.5 }, 'AI & ML': { attended: 23, total: 32, percentage: 71.9 } },
    subjectScores: { 'Data Structures': { marks: 58, maxMarks: 100, grade: 'C' }, 'DBMS': { marks: 60, maxMarks: 100, grade: 'B' }, 'Operating Systems': { marks: 49, maxMarks: 100, grade: 'D' }, 'Computer Networks': { marks: 52, maxMarks: 100, grade: 'C' }, 'AI & ML': { marks: 60, maxMarks: 100, grade: 'B' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.5 }, { semester: 'Sem 2', gpa: 6.7 }, { semester: 'Sem 3', gpa: 6.9 }, { semester: 'Sem 4', gpa: 7.1 }, { semester: 'Sem 5', gpa: 7.0 }],
    codingSolved: 55, codingWeekSolved: 2, codingStreak: 2, placementScore: 45,
  },
  {
    name: 'Janani Subramanian',    email: 'janani.subramanian@bitsathy.ac.in',
    department: 'Artificial Intelligence & Data Science', registerNumber: '21AD052', year: 3, semester: 5, section: 'B', phone: '+91 98765 22010',
    cgpa: 8.50, riskLevel: 'Low', attendance: 89, academicScore: 84,
    avatarInitials: 'JS', aiInsight: 'Strong data analytics reporting with Tableau, PowerBI, and data warehousing.',
    recommendedAction: 'Position for business intelligence and analytics consultant roles.',
    skills: ['Tableau', 'PowerBI', 'SQL', 'Python', 'ETL'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Infosys', ctc: '4.5 LPA', driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 31, total: 35, percentage: 88.6 }, 'DBMS': { attended: 29, total: 32, percentage: 90.6 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 29, total: 32, percentage: 90.6 } },
    subjectScores: { 'Data Structures': { marks: 84, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 88, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 80, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 81, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 86, maxMarks: 100, grade: 'A+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.0 }, { semester: 'Sem 2', gpa: 8.3 }, { semester: 'Sem 3', gpa: 8.4 }, { semester: 'Sem 4', gpa: 8.6 }, { semester: 'Sem 5', gpa: 8.5 }],
    codingSolved: 195, codingWeekSolved: 9, codingStreak: 14, placementScore: 76,
  },
  {
    name: 'Kishore Anbarasu',      email: 'kishore.anbarasu@bitsathy.ac.in',
    department: 'Electronics & Communication', registerNumber: '21EC015', year: 3, semester: 5, section: 'A', phone: '+91 98765 22011',
    cgpa: 7.65, riskLevel: 'Low', attendance: 82, academicScore: 74,
    avatarInitials: 'KA', aiInsight: 'Good hardware interfacing with microcontrollers and wireless telemetry protocols.',
    recommendedAction: 'Engage in smart sensor IoT prototype capstone.',
    skills: ['Embedded C', 'IoT', 'Arduino', 'Python', 'MQTT'], placementEligibility: 'Eligible',
    placementStatus: 'In Process', applicationStatus: 'Shortlisted', company: 'TCS', ctc: null, driveDate: '2026-08-15',
    subjectAttendance: { 'Data Structures': { attended: 29, total: 35, percentage: 82.9 }, 'DBMS': { attended: 26, total: 32, percentage: 81.3 }, 'Operating Systems': { attended: 25, total: 30, percentage: 83.3 }, 'Computer Networks': { attended: 24, total: 29, percentage: 82.8 }, 'AI & ML': { attended: 26, total: 32, percentage: 81.3 } },
    subjectScores: { 'Data Structures': { marks: 74, maxMarks: 100, grade: 'B+' }, 'DBMS': { marks: 76, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 72, maxMarks: 100, grade: 'B+' }, 'Computer Networks': { marks: 73, maxMarks: 100, grade: 'B+' }, 'AI & ML': { marks: 75, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.2 }, { semester: 'Sem 2', gpa: 7.5 }, { semester: 'Sem 3', gpa: 7.6 }, { semester: 'Sem 4', gpa: 7.7 }, { semester: 'Sem 5', gpa: 7.7 }],
    codingSolved: 140, codingWeekSolved: 6, codingStreak: 8, placementScore: 66,
  },
  {
    name: 'Lavanya Natarajan',     email: 'lavanya.natarajan@bitsathy.ac.in',
    department: 'Electronics & Communication', registerNumber: '21EC028', year: 3, semester: 5, section: 'A', phone: '+91 98765 22012',
    cgpa: 8.75, riskLevel: 'Low', attendance: 94, academicScore: 88,
    avatarInitials: 'LN', aiInsight: 'Stellar academic records in digital system design and VLSI timing analysis.',
    recommendedAction: 'Recommend for semiconductor and digital logic design campus drives.',
    skills: ['VLSI', 'Verilog', 'MATLAB', 'Digital Design', 'C'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 33, total: 35, percentage: 94.3 }, 'DBMS': { attended: 30, total: 32, percentage: 93.8 }, 'Operating Systems': { attended: 28, total: 30, percentage: 93.3 }, 'Computer Networks': { attended: 27, total: 29, percentage: 93.1 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 89, maxMarks: 100, grade: 'A+' }, 'DBMS': { marks: 91, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 85, maxMarks: 100, grade: 'A+' }, 'Computer Networks': { marks: 86, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 90, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.2 }, { semester: 'Sem 2', gpa: 8.5 }, { semester: 'Sem 3', gpa: 8.7 }, { semester: 'Sem 4', gpa: 8.8 }, { semester: 'Sem 5', gpa: 8.8 }],
    codingSolved: 240, codingWeekSolved: 12, codingStreak: 17, placementScore: 82,
  },
  {
    name: 'Madhavan Ganesan',      email: 'madhavan.ganesan@bitsathy.ac.in',
    department: 'Electronics & Communication', registerNumber: '21EC042', year: 3, semester: 5, section: 'A', phone: '+91 98765 22013',
    cgpa: 6.70, riskLevel: 'High', attendance: 65, academicScore: 53,
    avatarInitials: 'MG', aiInsight: 'Attendance below 65% across multiple courses; struggling with logic simulation.',
    recommendedAction: 'Enforce daily biometric log and arrange faculty counseling.',
    skills: ['C', 'Basics of Circuit Analysis', 'Eagle'], placementEligibility: 'Not Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Not Applied', company: null, ctc: null, driveDate: null,
    subjectAttendance: { 'Data Structures': { attended: 22, total: 35, percentage: 62.8 }, 'DBMS': { attended: 21, total: 32, percentage: 65.6 }, 'Operating Systems': { attended: 19, total: 30, percentage: 63.3 }, 'Computer Networks': { attended: 18, total: 29, percentage: 62.1 }, 'AI & ML': { attended: 22, total: 32, percentage: 68.8 } },
    subjectScores: { 'Data Structures': { marks: 54, maxMarks: 100, grade: 'C' }, 'DBMS': { marks: 56, maxMarks: 100, grade: 'C' }, 'Operating Systems': { marks: 48, maxMarks: 100, grade: 'D' }, 'Computer Networks': { marks: 50, maxMarks: 100, grade: 'D' }, 'AI & ML': { marks: 57, maxMarks: 100, grade: 'C' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.3 }, { semester: 'Sem 2', gpa: 6.5 }, { semester: 'Sem 3', gpa: 6.7 }, { semester: 'Sem 4', gpa: 6.8 }, { semester: 'Sem 5', gpa: 6.7 }],
    codingSolved: 40, codingWeekSolved: 1, codingStreak: 1, placementScore: 38,
  },
  {
    name: 'Nandhini Chelladurai',  email: 'nandhini.chelladurai@bitsathy.ac.in',
    department: 'Electronics & Communication', registerNumber: '21EC055', year: 3, semester: 5, section: 'A', phone: '+91 98765 22014',
    cgpa: 8.20, riskLevel: 'Low', attendance: 87, academicScore: 80,
    avatarInitials: 'NC', aiInsight: 'Proficient in ARM cortex firmware and RTOS scheduling primitives.',
    recommendedAction: 'Prepare for embedded systems technical assessment rounds.',
    skills: ['Embedded Systems', 'RTOS', 'ARM Cortex', 'Python', 'Git'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 31, total: 35, percentage: 88.6 }, 'DBMS': { attended: 28, total: 32, percentage: 87.5 }, 'Operating Systems': { attended: 26, total: 30, percentage: 86.7 }, 'Computer Networks': { attended: 25, total: 29, percentage: 86.2 }, 'AI & ML': { attended: 27, total: 32, percentage: 84.4 } },
    subjectScores: { 'Data Structures': { marks: 80, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 82, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 78, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 79, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 81, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.7 }, { semester: 'Sem 2', gpa: 8.0 }, { semester: 'Sem 3', gpa: 8.1 }, { semester: 'Sem 4', gpa: 8.3 }, { semester: 'Sem 5', gpa: 8.2 }],
    codingSolved: 210, codingWeekSolved: 10, codingStreak: 13, placementScore: 75,
  },
  {
    name: 'Pranesh Soundar',       email: 'pranesh.soundar@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS115', year: 3, semester: 5, section: 'B', phone: '+91 98765 22015',
    cgpa: 9.05, riskLevel: 'Low', attendance: 95, academicScore: 91,
    avatarInitials: 'PS', aiInsight: 'Exceptional full-stack web architect with top rank in university coding hackathons.',
    recommendedAction: 'Recommend for Dream Product engineering roles.',
    skills: ['Full Stack', 'Next.js', 'GraphQL', 'Prisma', 'PostgreSQL', 'DSA'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02',
    subjectAttendance: { 'Data Structures': { attended: 34, total: 35, percentage: 97.1 }, 'DBMS': { attended: 31, total: 32, percentage: 96.9 }, 'Operating Systems': { attended: 28, total: 30, percentage: 93.3 }, 'Computer Networks': { attended: 28, total: 29, percentage: 96.6 }, 'AI & ML': { attended: 31, total: 32, percentage: 96.9 } },
    subjectScores: { 'Data Structures': { marks: 96, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 93, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 88, maxMarks: 100, grade: 'A+' }, 'Computer Networks': { marks: 89, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 93, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.7 }, { semester: 'Sem 2', gpa: 9.0 }, { semester: 'Sem 3', gpa: 9.1 }, { semester: 'Sem 4', gpa: 9.2 }, { semester: 'Sem 5', gpa: 9.1 }],
    codingSolved: 335, codingWeekSolved: 17, codingStreak: 29, placementScore: 94,
  },
  {
    name: 'Rakshita Muthu',        email: 'rakshita.muthu@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS122', year: 3, semester: 5, section: 'B', phone: '+91 98765 22016',
    cgpa: 7.30, riskLevel: 'Medium', attendance: 76, academicScore: 68,
    avatarInitials: 'RM', aiInsight: 'Solid foundation in Java OOP; needs more practice in SQL index tuning.',
    recommendedAction: 'Review database lab assignments and give mock interview.',
    skills: ['Java', 'Spring Basics', 'MySQL', 'Bootstrap'], placementEligibility: 'Eligible',
    placementStatus: 'Seeking', applicationStatus: 'Applied', company: 'TCS', ctc: null, driveDate: '2026-08-22',
    subjectAttendance: { 'Data Structures': { attended: 27, total: 35, percentage: 77.1 }, 'DBMS': { attended: 24, total: 32, percentage: 75.0 }, 'Operating Systems': { attended: 23, total: 30, percentage: 76.7 }, 'Computer Networks': { attended: 22, total: 29, percentage: 75.9 }, 'AI & ML': { attended: 25, total: 32, percentage: 78.1 } },
    subjectScores: { 'Data Structures': { marks: 68, maxMarks: 100, grade: 'B' }, 'DBMS': { marks: 66, maxMarks: 100, grade: 'B' }, 'Operating Systems': { marks: 65, maxMarks: 100, grade: 'B' }, 'Computer Networks': { marks: 62, maxMarks: 100, grade: 'B' }, 'AI & ML': { marks: 71, maxMarks: 100, grade: 'B+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 6.9 }, { semester: 'Sem 2', gpa: 7.1 }, { semester: 'Sem 3', gpa: 7.2 }, { semester: 'Sem 4', gpa: 7.4 }, { semester: 'Sem 5', gpa: 7.3 }],
    codingSolved: 105, codingWeekSolved: 5, codingStreak: 6, placementScore: 59,
  },
  {
    name: 'Saravanan Thangaraj',   email: 'saravanan.thangaraj@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS130', year: 3, semester: 5, section: 'B', phone: '+91 98765 22017',
    cgpa: 8.45, riskLevel: 'Low', attendance: 88, academicScore: 82,
    avatarInitials: 'ST', aiInsight: 'Strong cybersecurity interests; solved 30+ Capture The Flag (CTF) challenges.',
    recommendedAction: 'Nominate for security analyst and network engineer roles.',
    skills: ['Cybersecurity', 'Ethical Hacking', 'Linux', 'Network Protocols', 'Python'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Infosys', ctc: '4.5 LPA', driveDate: '2026-08-20',
    subjectAttendance: { 'Data Structures': { attended: 31, total: 35, percentage: 88.6 }, 'DBMS': { attended: 28, total: 32, percentage: 87.5 }, 'Operating Systems': { attended: 26, total: 30, percentage: 86.7 }, 'Computer Networks': { attended: 27, total: 29, percentage: 93.1 }, 'AI & ML': { attended: 28, total: 32, percentage: 87.5 } },
    subjectScores: { 'Data Structures': { marks: 83, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 81, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 80, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 88, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 82, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.9 }, { semester: 'Sem 2', gpa: 8.2 }, { semester: 'Sem 3', gpa: 8.3 }, { semester: 'Sem 4', gpa: 8.5 }, { semester: 'Sem 5', gpa: 8.5 }],
    codingSolved: 215, codingWeekSolved: 10, codingStreak: 16, placementScore: 78,
  },
  {
    name: 'Tejaswini Raghu',       email: 'tejaswini.raghu@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS138', year: 3, semester: 5, section: 'B', phone: '+91 98765 22018',
    cgpa: 8.85, riskLevel: 'Low', attendance: 92, academicScore: 88,
    avatarInitials: 'TR', aiInsight: 'High proficiency in mobile application architecture and MongoDB aggregations.',
    recommendedAction: 'Encourage competing in national app design hackathons.',
    skills: ['React Native', 'React', 'JavaScript', 'Node.js', 'MongoDB'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28',
    subjectAttendance: { 'Data Structures': { attended: 33, total: 35, percentage: 94.3 }, 'DBMS': { attended: 30, total: 32, percentage: 93.8 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 26, total: 29, percentage: 89.7 }, 'AI & ML': { attended: 30, total: 32, percentage: 93.8 } },
    subjectScores: { 'Data Structures': { marks: 90, maxMarks: 100, grade: 'O' }, 'DBMS': { marks: 91, maxMarks: 100, grade: 'O' }, 'Operating Systems': { marks: 84, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 85, maxMarks: 100, grade: 'A+' }, 'AI & ML': { marks: 90, maxMarks: 100, grade: 'O' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.3 }, { semester: 'Sem 2', gpa: 8.6 }, { semester: 'Sem 3', gpa: 8.7 }, { semester: 'Sem 4', gpa: 8.9 }, { semester: 'Sem 5', gpa: 8.9 }],
    codingSolved: 275, codingWeekSolved: 13, codingStreak: 22, placementScore: 86,
  },
  {
    name: 'Vignesh Kanna',         email: 'vignesh.kanna@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS145', year: 3, semester: 5, section: 'B', phone: '+91 98765 22019',
    cgpa: 7.75, riskLevel: 'Low', attendance: 81, academicScore: 76,
    avatarInitials: 'VK', aiInsight: 'Good grasp of Java enterprise patterns and relational schema design.',
    recommendedAction: 'Conduct mock technical interview on Spring Boot REST architecture.',
    skills: ['Java', 'Hibernate', 'Spring Boot', 'REST APIs', 'PostgreSQL'], placementEligibility: 'Eligible',
    placementStatus: 'In Process', applicationStatus: 'Shortlisted', company: 'Zoho', ctc: null, driveDate: '2026-08-12',
    subjectAttendance: { 'Data Structures': { attended: 29, total: 35, percentage: 82.9 }, 'DBMS': { attended: 26, total: 32, percentage: 81.3 }, 'Operating Systems': { attended: 24, total: 30, percentage: 80.0 }, 'Computer Networks': { attended: 24, total: 29, percentage: 82.8 }, 'AI & ML': { attended: 26, total: 32, percentage: 81.3 } },
    subjectScores: { 'Data Structures': { marks: 76, maxMarks: 100, grade: 'A' }, 'DBMS': { marks: 80, maxMarks: 100, grade: 'A' }, 'Operating Systems': { marks: 74, maxMarks: 100, grade: 'B+' }, 'Computer Networks': { marks: 73, maxMarks: 100, grade: 'B+' }, 'AI & ML': { marks: 78, maxMarks: 100, grade: 'A' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 7.3 }, { semester: 'Sem 2', gpa: 7.5 }, { semester: 'Sem 3', gpa: 7.6 }, { semester: 'Sem 4', gpa: 7.8 }, { semester: 'Sem 5', gpa: 7.8 }],
    codingSolved: 165, codingWeekSolved: 7, codingStreak: 10, placementScore: 69,
  },
  {
    name: 'Yamini Sivakumar',      email: 'yamini.sivakumar@bitsathy.ac.in',
    department: 'Computer Science', registerNumber: '21CS150', year: 3, semester: 5, section: 'B', phone: '+91 98765 22020',
    cgpa: 8.60, riskLevel: 'Low', attendance: 91, academicScore: 85,
    avatarInitials: 'YS', aiInsight: 'Solid DevOps and cloud infrastructure provisioning skills with Terraform.',
    recommendedAction: 'Recommend for Site Reliability Engineering (SRE) and cloud architect roles.',
    skills: ['AWS Cloud', 'DevOps', 'Terraform', 'Python', 'Linux'], placementEligibility: 'Eligible',
    placementStatus: 'Placed', applicationStatus: 'Selected', company: 'TCS', ctc: '3.8 LPA', driveDate: '2026-07-20',
    subjectAttendance: { 'Data Structures': { attended: 32, total: 35, percentage: 91.4 }, 'DBMS': { attended: 29, total: 32, percentage: 90.6 }, 'Operating Systems': { attended: 27, total: 30, percentage: 90.0 }, 'Computer Networks': { attended: 26, total: 29, percentage: 89.7 }, 'AI & ML': { attended: 29, total: 32, percentage: 90.6 } },
    subjectScores: { 'Data Structures': { marks: 87, maxMarks: 100, grade: 'A+' }, 'DBMS': { marks: 86, maxMarks: 100, grade: 'A+' }, 'Operating Systems': { marks: 83, maxMarks: 100, grade: 'A' }, 'Computer Networks': { marks: 82, maxMarks: 100, grade: 'A' }, 'AI & ML': { marks: 87, maxMarks: 100, grade: 'A+' } },
    semesterHistory: [{ semester: 'Sem 1', gpa: 8.1 }, { semester: 'Sem 2', gpa: 8.4 }, { semester: 'Sem 3', gpa: 8.5 }, { semester: 'Sem 4', gpa: 8.6 }, { semester: 'Sem 5', gpa: 8.6 }],
    codingSolved: 250, codingWeekSolved: 12, codingStreak: 18, placementScore: 81,
  },
];

// ─── Staff data ───────────────────────────────────────────────────────────────
const DEMO_STAFF = [
  { name: 'Dr. Priya Sharma',         email: 'priya.faculty@bitsathy.ac.in', department: 'Computer Science & Engineering', designation: 'Associate Professor & Class Advisor', employeeId: 'STF-CS-042', phone: '+91 94432 18765' },
  { name: 'Prof. Rajesh Kumar',       email: 'rajesh.faculty@bitsathy.ac.in', department: 'Artificial Intelligence & Data Science', designation: 'Professor & HOD', employeeId: 'STF-AD-018', phone: '+91 94432 18766' },
  { name: 'Staff User',               email: 'staff@bitsathy.ac.in', department: 'Computer Science', designation: 'Professor', employeeId: 'EMP001', phone: '+91 94432 00000' },
  // ─── 20 Additional Staff in DB ───────────────────────────────────────────────
  { name: 'Dr. Meena Krishnan',       email: 'meena.krishnan@bitsathy.ac.in', department: 'Computer Science & Engineering', designation: 'Professor', employeeId: 'STF-CS-055', phone: '+91 94432 18701' },
  { name: 'Dr. Ravi Chandran',        email: 'ravi.chandran@bitsathy.ac.in', department: 'Computer Science & Engineering', designation: 'Associate Professor', employeeId: 'STF-CS-062', phone: '+91 94432 18702' },
  { name: 'Dr. Arun Patel',           email: 'arun.patel@bitsathy.ac.in', department: 'Computer Science & Engineering', designation: 'Associate Professor', employeeId: 'STF-CS-070', phone: '+91 94432 18703' },
  { name: 'Dr. Kavitha Mohan',        email: 'kavitha.mohan@bitsathy.ac.in', department: 'Computer Science & Engineering', designation: 'Assistant Professor', employeeId: 'STF-CS-081', phone: '+91 94432 18704' },
  { name: 'Prof. Senthil Nathan',     email: 'senthil.nathan@bitsathy.ac.in', department: 'Computer Science & Engineering', designation: 'Assistant Professor', employeeId: 'STF-CS-093', phone: '+91 94432 18705' },
  { name: 'Dr. Anandhi Rajan',        email: 'anandhi.rajan@bitsathy.ac.in', department: 'Artificial Intelligence & Data Science', designation: 'Associate Professor', employeeId: 'STF-AD-024', phone: '+91 94432 18706' },
  { name: 'Dr. Vigneshwaran S',       email: 'vigneshwaran.s@bitsathy.ac.in', department: 'Artificial Intelligence & Data Science', designation: 'Assistant Professor', employeeId: 'STF-AD-035', phone: '+91 94432 18707' },
  { name: 'Prof. Divya Lakshmi',      email: 'divya.lakshmi@bitsathy.ac.in', department: 'Artificial Intelligence & Data Science', designation: 'Assistant Professor', employeeId: 'STF-AD-046', phone: '+91 94432 18708' },
  { name: 'Dr. Karthikeyan P',        email: 'karthikeyan.p@bitsathy.ac.in', department: 'Artificial Intelligence & Data Science', designation: 'Professor', employeeId: 'STF-AD-058', phone: '+91 94432 18709' },
  { name: 'Dr. Malathi Sundar',       email: 'malathi.sundar@bitsathy.ac.in', department: 'Information Technology', designation: 'Professor & HOD', employeeId: 'STF-IT-011', phone: '+91 94432 18710' },
  { name: 'Prof. Bala Subramanian',   email: 'bala.subramanian@bitsathy.ac.in', department: 'Information Technology', designation: 'Associate Professor', employeeId: 'STF-IT-022', phone: '+91 94432 18711' },
  { name: 'Dr. Shalini Devi',         email: 'shalini.devi@bitsathy.ac.in', department: 'Information Technology', designation: 'Assistant Professor', employeeId: 'STF-IT-033', phone: '+91 94432 18712' },
  { name: 'Prof. Praveen Kumar M',    email: 'praveen.kumar.m@bitsathy.ac.in', department: 'Information Technology', designation: 'Assistant Professor', employeeId: 'STF-IT-044', phone: '+91 94432 18713' },
  { name: 'Dr. Jayanthi Raman',       email: 'jayanthi.raman@bitsathy.ac.in', department: 'Electronics & Communication', designation: 'Professor & HOD', employeeId: 'STF-EC-015', phone: '+91 94432 18714' },
  { name: 'Dr. Murugesan K',          email: 'murugesan.k@bitsathy.ac.in', department: 'Electronics & Communication', designation: 'Associate Professor', employeeId: 'STF-EC-027', phone: '+91 94432 18715' },
  { name: 'Prof. Deepa Vellingiri',   email: 'deepa.vellingiri@bitsathy.ac.in', department: 'Electronics & Communication', designation: 'Assistant Professor', employeeId: 'STF-EC-039', phone: '+91 94432 18716' },
  { name: 'Dr. Ashok Chakravarthy',   email: 'ashok.chakravarthy@bitsathy.ac.in', department: 'Electronics & Communication', designation: 'Associate Professor', employeeId: 'STF-EC-052', phone: '+91 94432 18717' },
  { name: 'Dr. Chandrasekar V',       email: 'chandrasekar.v@bitsathy.ac.in', department: 'Training & Placement', designation: 'Head of Placements (Director)', employeeId: 'STF-TPO-001', phone: '+91 94432 18718' },
  { name: 'Prof. Revathi S',          email: 'revathi.s@bitsathy.ac.in', department: 'Training & Placement', designation: 'Senior Placement Officer', employeeId: 'STF-TPO-002', phone: '+91 94432 18719' },
  { name: 'Dr. Saravana Bhavan',      email: 'saravana.bhavan@bitsathy.ac.in', department: 'Academic Affairs', designation: 'Dean of Academics', employeeId: 'STF-DEAN-001', phone: '+91 94432 18720' },
];

export const initDb = async () => {
  try {
    // 1. Ensure base tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        department VARCHAR(255),
        register_number VARCHAR(100),
        year INTEGER DEFAULT 3,
        semester INTEGER DEFAULT 5,
        section VARCHAR(10),
        cgpa NUMERIC(4,2) DEFAULT 0,
        risk_level VARCHAR(20) DEFAULT 'Low',
        attendance NUMERIC(5,2) DEFAULT 0,
        academic_score NUMERIC(5,2) DEFAULT 0,
        avatar_initials VARCHAR(5),
        ai_insight TEXT,
        recommended_action TEXT,
        skills JSONB DEFAULT '[]',
        placement_eligibility VARCHAR(100),
        placement_status VARCHAR(100),
        application_status VARCHAR(100),
        company VARCHAR(255),
        ctc VARCHAR(50),
        drive_date DATE,
        subject_attendance JSONB DEFAULT '{}',
        subject_scores JSONB DEFAULT '{}',
        semester_history JSONB DEFAULT '[]',
        coding_solved INTEGER DEFAULT 0,
        coding_week_solved INTEGER DEFAULT 0,
        coding_streak INTEGER DEFAULT 0,
        placement_score INTEGER DEFAULT 0,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add new columns if they don't exist (for existing DBs)
    const newColumns = [
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS cgpa NUMERIC(4,2) DEFAULT 0`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'Low'`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance NUMERIC(5,2) DEFAULT 0`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS academic_score NUMERIC(5,2) DEFAULT 0`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS avatar_initials VARCHAR(5)`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS ai_insight TEXT`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS recommended_action TEXT`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS placement_eligibility VARCHAR(100)`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS placement_status VARCHAR(100)`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS application_status VARCHAR(100)`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS company VARCHAR(255)`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS ctc VARCHAR(50)`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS drive_date DATE`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS subject_attendance JSONB DEFAULT '{}'`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS subject_scores JSONB DEFAULT '{}'`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS semester_history JSONB DEFAULT '[]'`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS coding_solved INTEGER DEFAULT 0`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS coding_week_solved INTEGER DEFAULT 0`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS coding_streak INTEGER DEFAULT 0`,
      `ALTER TABLE students ADD COLUMN IF NOT EXISTS placement_score INTEGER DEFAULT 0`,
    ];
    for (const q of newColumns) {
      await pool.query(q).catch(() => {}); // ignore if already exists
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        designation VARCHAR(255),
        employee_id VARCHAR(100),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const defaultHash = await bcrypt.hash('password123', 10);

    // 2. Seed / Synchronize all Students
    for (const student of DEMO_STUDENTS) {
      const emailLower = student.email.toLowerCase();
      const userRes = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [emailLower]);
      let userId: string;

      if (userRes.rows.length === 0) {
        userId = randomUUID();
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5, true)`,
          [userId, student.name, emailLower, defaultHash, 'STUDENT']
        );
      } else {
        userId = userRes.rows[0].id;
        await pool.query(
          'UPDATE users SET name = $1, password_hash = $2, role = $3, is_active = true WHERE id = $4',
          [student.name, defaultHash, 'STUDENT', userId]
        );
      }

      const studRes = await pool.query('SELECT id FROM students WHERE user_id = $1', [userId]);
      if (studRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO students (id, user_id, name, email, department, register_number, phone, year, semester, section,
            cgpa, risk_level, attendance, academic_score, avatar_initials, ai_insight, recommended_action,
            skills, placement_eligibility, placement_status, application_status, company, ctc, drive_date,
            subject_attendance, subject_scores, semester_history, coding_solved, coding_week_solved, coding_streak, placement_score)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)`,
          [
            randomUUID(), userId, student.name, emailLower, student.department, student.registerNumber,
            student.phone, student.year, student.semester, student.section,
            student.cgpa, student.riskLevel, student.attendance, student.academicScore,
            student.avatarInitials, student.aiInsight, student.recommendedAction,
            JSON.stringify(student.skills), student.placementEligibility, student.placementStatus,
            student.applicationStatus, student.company, student.ctc, student.driveDate,
            JSON.stringify(student.subjectAttendance), JSON.stringify(student.subjectScores),
            JSON.stringify(student.semesterHistory),
            student.codingSolved, student.codingWeekSolved, student.codingStreak, student.placementScore,
          ]
        );
      } else {
        await pool.query(
          `UPDATE students SET
            name=$1, email=$2, department=$3, register_number=$4, phone=$5, year=$6, semester=$7, section=$8,
            cgpa=$9, risk_level=$10, attendance=$11, academic_score=$12, avatar_initials=$13, ai_insight=$14,
            recommended_action=$15, skills=$16, placement_eligibility=$17, placement_status=$18,
            application_status=$19, company=$20, ctc=$21, drive_date=$22,
            subject_attendance=$23, subject_scores=$24, semester_history=$25,
            coding_solved=$26, coding_week_solved=$27, coding_streak=$28, placement_score=$29
           WHERE user_id=$30`,
          [
            student.name, emailLower, student.department, student.registerNumber, student.phone,
            student.year, student.semester, student.section,
            student.cgpa, student.riskLevel, student.attendance, student.academicScore,
            student.avatarInitials, student.aiInsight, student.recommendedAction,
            JSON.stringify(student.skills), student.placementEligibility, student.placementStatus,
            student.applicationStatus, student.company, student.ctc, student.driveDate,
            JSON.stringify(student.subjectAttendance), JSON.stringify(student.subjectScores),
            JSON.stringify(student.semesterHistory),
            student.codingSolved, student.codingWeekSolved, student.codingStreak, student.placementScore,
            userId,
          ]
        );
      }
    }

    // 3. Seed / Synchronize all Staff
    for (const staffMember of DEMO_STAFF) {
      const emailLower = staffMember.email.toLowerCase();
      const userRes = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [emailLower]);
      let userId: string;

      if (userRes.rows.length === 0) {
        userId = randomUUID();
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5, true)`,
          [userId, staffMember.name, emailLower, defaultHash, 'STAFF']
        );
      } else {
        userId = userRes.rows[0].id;
        await pool.query(
          'UPDATE users SET name = $1, password_hash = $2, role = $3, is_active = true WHERE id = $4',
          [staffMember.name, defaultHash, 'STAFF', userId]
        );
      }

      const staffRes = await pool.query('SELECT id FROM staff WHERE user_id = $1', [userId]);
      if (staffRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO staff (id, user_id, name, email, department, designation, employee_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [randomUUID(), userId, staffMember.name, emailLower, staffMember.department, staffMember.designation, staffMember.employeeId]
        );
      } else {
        await pool.query(
          `UPDATE staff SET name=$1, email=$2, department=$3, designation=$4, employee_id=$5 WHERE user_id=$6`,
          [staffMember.name, emailLower, staffMember.department, staffMember.designation, staffMember.employeeId, userId]
        );
      }
    }

    // 4. Seed Standard Subjects if missing
    const standardSubjects = [
      { code: 'CS501', name: 'Database Management Systems', semester: 5, credits: 4 },
      { code: 'CS502', name: 'Data Structures & Algorithms', semester: 5, credits: 4 },
      { code: 'CS503', name: 'Operating Systems', semester: 5, credits: 3 },
      { code: 'CS504', name: 'Computer Networks', semester: 5, credits: 3 },
      { code: 'CS505', name: 'Artificial Intelligence & ML', semester: 5, credits: 4 },
    ];
    for (const sub of standardSubjects) {
      try {
        const exist = await pool.query('SELECT id FROM subjects WHERE subject_code = $1', [sub.code]);
        if (exist.rows.length === 0) {
          await pool.query(
            `INSERT INTO subjects (id, subject_code, subject_name, semester, credits) VALUES ($1, $2, $3, $4, $5)`,
            [randomUUID(), sub.code, sub.name, sub.semester, sub.credits]
          );
        }
      } catch {
        // ignore
      }
    }

    // 5. Seed Standard Companies if missing
    const standardCompanies = [
      { name: 'Zoho Corporation', role: 'Software Developer', pkg: '5.50 LPA', location: 'Chennai, TN', date: '2026-08-02' },
      { name: 'Accenture India', role: 'Associate Software Eng.', pkg: '6.50 LPA', location: 'Bengaluru, KA', date: '2026-07-28' },
      { name: 'Tata Consultancy Services', role: 'System Engineer', pkg: '3.80 LPA', location: 'Coimbatore, TN', date: '2026-07-20' },
      { name: 'Infosys Limited', role: 'Specialist Programmer', pkg: '4.50 LPA', location: 'Mysuru, KA', date: '2026-08-20' },
    ];
    for (const comp of standardCompanies) {
      try {
        const exist = await pool.query('SELECT id FROM companies WHERE company_name = $1', [comp.name]);
        if (exist.rows.length === 0) {
          await pool.query(
            `INSERT INTO companies (id, company_name, description, job_role, location, package, eligibility, application_deadline, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
            [
              randomUUID(), comp.name, `${comp.name} On-Campus Recruitment Drive`,
              comp.role, comp.location, comp.pkg, 'CGPA >= 7.0 and No Standing Arrears',
              comp.date
            ]
          );
        }
      } catch {
        // ignore
      }
    }

    // 6. Populate relational tables (attendance, academic_records, placement_applications) for all students
    try {
      const allStudentsRes = await pool.query('SELECT id, subject_scores, subject_attendance, company, application_status, placement_status FROM students');
      const allSubjectsRes = await pool.query('SELECT id, subject_name FROM subjects');
      const allCompaniesRes = await pool.query('SELECT id, company_name FROM companies');

      for (const st of allStudentsRes.rows) {
        // Academic records
        if (st.subject_scores && typeof st.subject_scores === 'object') {
          for (const [subName, scoreData] of Object.entries(st.subject_scores as Record<string, any>)) {
            const matchedSub = allSubjectsRes.rows.find(s => s.subject_name.toLowerCase().includes(subName.toLowerCase()));
            if (matchedSub && scoreData) {
              const recExist = await pool.query('SELECT id FROM academic_records WHERE student_id = $1 AND subject_id = $2', [st.id, matchedSub.id]);
              if (recExist.rows.length === 0) {
                await pool.query(
                  `INSERT INTO academic_records (id, student_id, subject_id, marks, grade, grade_point, semester, academic_year, created_at, updated_at)
                   VALUES ($1, $2, $3, $4, $5, $6, 5, '2025-2026', NOW(), NOW())`,
                  [randomUUID(), st.id, matchedSub.id, scoreData.marks || 75, scoreData.grade || 'A', ((scoreData.marks || 75) / 10).toFixed(1)]
                );
              }
            }
          }
        }

        // Attendance records
        if (st.subject_attendance && typeof st.subject_attendance === 'object') {
          for (const [subName, attData] of Object.entries(st.subject_attendance as Record<string, any>)) {
            const matchedSub = allSubjectsRes.rows.find(s => s.subject_name.toLowerCase().includes(subName.toLowerCase()));
            if (matchedSub && attData) {
              const attExist = await pool.query('SELECT id FROM attendance WHERE student_id = $1 AND subject_id = $2', [st.id, matchedSub.id]);
              if (attExist.rows.length === 0) {
                await pool.query(
                  `INSERT INTO attendance (id, student_id, subject_id, date, status, percentage, created_at, updated_at)
                   VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, NOW(), NOW())`,
                  [randomUUID(), st.id, matchedSub.id, (attData.percentage >= 75 ? 'Present' : 'Absent'), attData.percentage || 80]
                );
              }
            }
          }
        }

        // Placement applications
        if (st.company) {
          const matchedComp = allCompaniesRes.rows.find(c => c.company_name.toLowerCase().includes(st.company.toLowerCase()));
          if (matchedComp) {
            const appExist = await pool.query('SELECT id FROM placement_applications WHERE student_id = $1 AND company_id = $2', [st.id, matchedComp.id]);
            if (appExist.rows.length === 0) {
              await pool.query(
                `INSERT INTO placement_applications (id, student_id, company_id, status, applied_at, updated_at)
                 VALUES ($1, $2, $3, $4, NOW(), NOW())`,
                [randomUUID(), st.id, matchedComp.id, st.application_status || 'Applied']
              );
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('⚠️ Relational tables synchronization notice:', e.message);
    }

    console.log('✅ PostgreSQL: All demo users (students + staff) successfully pushed and synchronized.');
  } catch (err: any) {
    console.warn('⚠️ PostgreSQL initialization notice:', err.message || err);
  }
};
