import { IStaffRepository } from './IStaffRepository.js';
import {
  StaffCohortOverview,
  StaffStudentSummary,
  AttendanceSession,
  AcademicMarkEntry,
  StaffPlacementStudent,
  AIStudentSupportCase,
  Announcement,
  StaffReportSummary,
} from '../types/index.js';

export class MockStaffRepository implements IStaffRepository {
  private cohortOverview: StaffCohortOverview = {
    totalStudents: 20,
    maxCohortCapacity: 20,
    avgAttendance: 83.8,
    avgAcademicScore: 77.4,
    placementRate: 81.2,
    atRiskStudentsCount: 4,
    highRiskCount: 2,
    mediumRiskCount: 2,
    lowRiskCount: 16,
    eligibleForPlacement: 16,
    totalPlaced: 13,
  };

  private studentsList: StaffStudentSummary[] = [
    {
      id: 'STU_101',
      name: 'Rahul Kumar',
      rollNumber: '21CS045',
      department: 'Computer Science',
      year: '3rd Year (Sem 5)',
      attendance: 68,
      academicScore: 52,
      cgpa: 6.8,
      riskLevel: 'High',
      avatarInitials: 'RK',
      email: 'rahul.kumar@bitsathy.ac.in',
      phone: '+91 98765 11001',
      aiInsight: 'Low attendance in Computer Networks (62%) and declining internal assessment scores.',
      recommendedAction: 'Schedule a 1-on-1 mentoring session and issue statutory attendance notification.',
      subjectAttendance: {
        'Data Structures': { attended: 22, total: 35, percentage: 62.8 },
        'DBMS': { attended: 24, total: 32, percentage: 75.0 },
        'Operating Systems': { attended: 20, total: 30, percentage: 66.7 },
        'Computer Networks': { attended: 18, total: 29, percentage: 62.1 },
        'AI & ML': { attended: 24, total: 32, percentage: 75.0 },
      },
      subjectScores: {
        'Data Structures': { marks: 54, maxMarks: 100, grade: 'C' },
        'DBMS': { marks: 58, maxMarks: 100, grade: 'C' },
        'Operating Systems': { marks: 48, maxMarks: 100, grade: 'D' },
        'Computer Networks': { marks: 46, maxMarks: 100, grade: 'D' },
        'AI & ML': { marks: 56, maxMarks: 100, grade: 'C' },
      },
      placementEligibility: 'Conditionally Eligible',
      applicationStatus: 'Not Applied',
      placementStatus: 'Seeking',
      skills: ['C', 'Python Basics', 'Git'],
    },
    {
      id: 'STU_102',
      name: 'Sneha Mohan',
      rollNumber: '21CS082',
      department: 'Computer Science',
      year: '3rd Year (Sem 5)',
      attendance: 71,
      academicScore: 58,
      cgpa: 7.1,
      riskLevel: 'High',
      avatarInitials: 'SM',
      email: 'sneha.mohan@bitsathy.ac.in',
      phone: '+91 98765 11002',
      aiInsight: 'Frequent absences on Mondays/Fridays; sudden drop in Operating Systems internals.',
      recommendedAction: 'Assign remedial assignment practice and conduct conceptual review on OS.',
      subjectAttendance: {
        'Data Structures': { attended: 26, total: 35, percentage: 74.3 },
        'DBMS': { attended: 23, total: 32, percentage: 71.9 },
        'Operating Systems': { attended: 19, total: 30, percentage: 63.3 },
        'Computer Networks': { attended: 22, total: 29, percentage: 75.9 },
        'AI & ML': { attended: 22, total: 32, percentage: 68.8 },
      },
      subjectScores: {
        'Data Structures': { marks: 62, maxMarks: 100, grade: 'B' },
        'DBMS': { marks: 60, maxMarks: 100, grade: 'B' },
        'Operating Systems': { marks: 52, maxMarks: 100, grade: 'C' },
        'Computer Networks': { marks: 58, maxMarks: 100, grade: 'B' },
        'AI & ML': { marks: 60, maxMarks: 100, grade: 'B' },
      },
      placementEligibility: 'Eligible',
      applicationStatus: 'Applied',
      placementStatus: 'Seeking',
      skills: ['C', 'Java', 'Web Basics'],
    },
    {
      id: 'STU_106',
      name: 'Arun Kumar',
      rollNumber: '21CS001',
      department: 'Computer Science',
      year: '3rd Year (Sem 5)',
      attendance: 92,
      academicScore: 88,
      cgpa: 8.4,
      riskLevel: 'Low',
      avatarInitials: 'AK',
      email: 'arun.kumar@bitsathy.ac.in',
      phone: '+91 98765 43210',
      aiInsight: 'Consistent top performer in algorithmic problem solving and active participation in class.',
      recommendedAction: 'Nominate for upcoming competitive hackathons and advanced project mentoring.',
      placementEligibility: 'Eligible',
      applicationStatus: 'Selected',
      placementStatus: 'Placed',
      skills: ['React', 'Node.js', 'Python', 'DSA'],
      company: 'Zoho',
      ctc: '5.5 LPA',
      driveDate: '2026-08-02',
    },
    {
      id: 'STU_107',
      name: 'Priya Sharma',
      rollNumber: '21AD045',
      department: 'Artificial Intelligence & Data Science',
      year: '3rd Year (Sem 5)',
      attendance: 95,
      academicScore: 94,
      cgpa: 9.1,
      riskLevel: 'Low',
      avatarInitials: 'PS',
      email: 'priya.sharma@bitsathy.ac.in',
      phone: '+91 98123 45678',
      aiInsight: 'Exceptional academic consistency and leadership in AI lab modules.',
      recommendedAction: 'Encourage publication submission for semester final project.',
      placementEligibility: 'Eligible',
      applicationStatus: 'Selected',
      placementStatus: 'Placed',
      skills: ['PyTorch', 'TensorFlow', 'Data Science', 'C++'],
      company: 'Accenture',
      ctc: '6.5 LPA',
      driveDate: '2026-07-28',
    },
  ];

  private attendanceSessions: AttendanceSession[] = [
    {
      id: 'SESS_1',
      date: '2026-08-10',
      subject: 'Data Structures & Algorithms',
      faculty: 'Dr. Priya Sharma',
      totalPresent: 18,
      totalStudents: 20,
      entries: [
        { studentId: 'STU_101', studentName: 'Rahul Kumar', rollNumber: '21CS045', status: 'Absent' },
        { studentId: 'STU_102', studentName: 'Sneha Mohan', rollNumber: '21CS082', status: 'Present' },
        { studentId: 'STU_106', studentName: 'Arun Kumar', rollNumber: '21CS001', status: 'Present' },
        { studentId: 'STU_107', studentName: 'Priya Sharma', rollNumber: '21AD045', status: 'Present' },
      ],
    },
  ];

  private academicMarks: AcademicMarkEntry[] = [
    { id: 'M_1', studentId: 'STU_101', studentName: 'Rahul Kumar', rollNumber: '21CS045', subject: 'Data Structures', assessmentType: 'Internal 1', marks: 22, maxMarks: 50, grade: 'C', date: '2026-07-15' },
    { id: 'M_2', studentId: 'STU_102', studentName: 'Sneha Mohan', rollNumber: '21CS082', subject: 'Data Structures', assessmentType: 'Internal 1', marks: 31, maxMarks: 50, grade: 'B', date: '2026-07-15' },
    { id: 'M_6', studentId: 'STU_106', studentName: 'Arun Kumar', rollNumber: '21CS001', subject: 'Data Structures', assessmentType: 'Internal 1', marks: 44, maxMarks: 50, grade: 'A+', date: '2026-07-15' },
    { id: 'M_7', studentId: 'STU_107', studentName: 'Priya Sharma', rollNumber: '21AD045', subject: 'Data Structures', assessmentType: 'Internal 1', marks: 48, maxMarks: 50, grade: 'O', date: '2026-07-15' },
  ];

  private placementRoster: StaffPlacementStudent[] = [
    { id: 'PL_1', name: 'Arun Kumar', rollNumber: '21CS001', cgpa: 8.4, skills: ['React', 'Node.js', 'Python', 'DSA'], eligibility: 'Eligible', applicationStatus: 'Selected', placementStatus: 'Placed', company: 'Zoho', ctc: '5.5 LPA', driveDate: '2026-08-02' },
    { id: 'PL_2', name: 'Priya Sharma', rollNumber: '21AD045', cgpa: 9.1, skills: ['PyTorch', 'TensorFlow', 'Data Science', 'C++'], eligibility: 'Eligible', applicationStatus: 'Selected', placementStatus: 'Placed', company: 'Accenture', ctc: '6.5 LPA', driveDate: '2026-07-28' },
    { id: 'PL_19', name: 'Rahul Kumar', rollNumber: '21CS045', cgpa: 6.8, skills: ['C', 'Python Basics', 'Git'], eligibility: 'Conditionally Eligible', applicationStatus: 'Not Applied', placementStatus: 'Seeking' },
    { id: 'PL_18', name: 'Sneha Mohan', rollNumber: '21CS082', cgpa: 7.1, skills: ['C', 'Java', 'Web Basics'], eligibility: 'Eligible', applicationStatus: 'Applied', placementStatus: 'Seeking', company: 'TCS', driveDate: '2026-08-22' },
  ];

  private supportCases: AIStudentSupportCase[] = [
    {
      id: 'SUP_1',
      studentId: 'STU_101',
      studentName: 'Rahul Kumar',
      rollNumber: '21CS045',
      department: 'Computer Science',
      attendance: 68,
      academicScore: 52,
      riskLevel: 'High',
      aiInsight: 'Low attendance and declining academic performance across core CS theory papers.',
      recommendedAction: 'Schedule a mentoring session and monitor attendance weekly.',
      staffRemarks: 'Student reported health issues during July. Advised to submit medical certificates and attend remedial classes.',
      intervention: '1-on-1 Academic Mentoring & Parent Notification',
      followUpDate: '2026-08-18',
      supportStatus: 'In Progress',
      lastUpdated: '2026-08-08',
    },
    {
      id: 'SUP_2',
      studentId: 'STU_102',
      studentName: 'Sneha Mohan',
      rollNumber: '21CS082',
      department: 'Computer Science',
      attendance: 71,
      academicScore: 58,
      riskLevel: 'High',
      aiInsight: 'Frequent absences on test days and inconsistent assignment submission timeline.',
      recommendedAction: 'Assign tailored revision modules and review progress in Operating Systems.',
      staffRemarks: 'Assigned OS practice problem set due by next Friday.',
      intervention: 'Remedial Assignments & Weekly Check-in',
      followUpDate: '2026-08-16',
      supportStatus: 'In Progress',
      lastUpdated: '2026-08-05',
    },
  ];

  private announcements: Announcement[] = [
    {
      id: 'ANN_1',
      title: 'Model Examination Schedule - Semester 5',
      description: 'The Model Examinations for 3rd Year CSE & AI-DS students will commence from August 24, 2026. Detailed seating arrangement will be posted on notice boards.',
      audience: 'All Students',
      date: '2026-08-08',
      author: 'Dr. Priya Sharma (Class Advisor)',
      category: 'Exam',
      pinned: true,
    },
    {
      id: 'ANN_2',
      title: 'Zoho Campus Recruitment Drive - Slot 2 Registration',
      description: 'Students with CGPA >= 7.5 and no active backlogs are eligible to apply for the upcoming Zoho technical screening by August 14.',
      audience: 'Computer Science',
      date: '2026-08-06',
      author: 'Placement Cell & Staff Committee',
      category: 'Placement',
      pinned: true,
    },
    {
      id: 'ANN_3',
      title: 'Mandatory Attendance Review Notice',
      description: 'Students having overall attendance below 75% as of August 10 must meet their respective faculty mentors by August 13 without fail.',
      audience: '3rd Year',
      date: '2026-08-04',
      author: 'Dr. Priya Sharma',
      category: 'Attendance',
      pinned: false,
    },
  ];

  private reports: StaffReportSummary[] = [
    {
      id: 'REP_1',
      title: 'Monthly Attendance Roster & Defaulters Report',
      category: 'Attendance',
      generatedDate: '2026-08-09',
      recordCount: 20,
      description: 'Comprehensive subject-wise attendance analytics including list of students below 75% threshold.',
      summaryMetrics: {
        'Assigned Cohort': '20 Students (Max Capacity)',
        'Avg Class Attendance': '83.8%',
        'Defaulters (<75%)': 3,
        'Attendance Rate': 'Good',
      },
    },
    {
      id: 'REP_2',
      title: 'Semester 5 Internal Assessment Marks Consolidated',
      category: 'Academics',
      generatedDate: '2026-08-07',
      recordCount: 20,
      description: 'Internal 1 & Internal 2 scores across all 5 subjects with grade point distribution for 20 cohort students.',
      summaryMetrics: {
        'Cohort Size': '20 Students',
        'Class Average': '77.4 / 100',
        'Pass Percentage': '95.0%',
        'Top Performer CGPA': '9.1',
      },
    },
    {
      id: 'REP_3',
      title: 'CampusAI At-Risk Student Predictive Analytics',
      category: 'At-Risk',
      generatedDate: '2026-08-08',
      recordCount: 4,
      description: 'AI model risk classification combining attendance trajectory, internal test scores, and assignment submission latencies.',
      summaryMetrics: {
        'Cohort Monitored': '20 Students',
        'High Risk Students': 2,
        'Medium Risk Students': 2,
        'Interventions Active': 4,
      },
    },
    {
      id: 'REP_4',
      title: 'Batch 2026 Campus Placement & Offer Status Report',
      category: 'Placement',
      generatedDate: '2026-08-06',
      recordCount: 20,
      description: 'Summary of company drive registrations, shortlists, selected offers, and average CTC statistics.',
      summaryMetrics: {
        'Assigned Students': '20 Students',
        'Eligible Students': 16,
        'Total Placed': 13,
        'Placement Rate': '81.2%',
      },
    },
  ];

  async getCohortOverview(): Promise<StaffCohortOverview> {
    return { ...this.cohortOverview };
  }

  async getStudentsList(filters?: { riskLevel?: string; department?: string; search?: string }): Promise<StaffStudentSummary[]> {
    let result = [...this.studentsList];

    if (filters?.riskLevel && filters.riskLevel !== 'All') {
      result = result.filter((s) => s.riskLevel.toLowerCase() === filters.riskLevel?.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async getStudentById(studentId: string): Promise<StaffStudentSummary | null> {
    const found = this.studentsList.find((s) => s.id === studentId || s.rollNumber === studentId);
    return found ? { ...found } : null;
  }

  async getAttendanceSessions(): Promise<AttendanceSession[]> {
    return [...this.attendanceSessions];
  }

  async saveAttendanceSession(session: AttendanceSession): Promise<AttendanceSession> {
    const newSession = {
      ...session,
      id: session.id || `SESS_${Date.now()}`,
    };
    this.attendanceSessions.unshift(newSession);
    return newSession;
  }

  async getAcademicMarks(subject?: string): Promise<AcademicMarkEntry[]> {
    if (subject && subject !== 'All Subjects') {
      return this.academicMarks.filter((m) => m.subject.toLowerCase() === subject.toLowerCase());
    }
    return [...this.academicMarks];
  }

  async saveAcademicMarks(marks: AcademicMarkEntry[]): Promise<AcademicMarkEntry[]> {
    this.academicMarks.push(...marks);
    return marks;
  }

  async getPlacementRoster(): Promise<StaffPlacementStudent[]> {
    return [...this.placementRoster];
  }

  async getSupportCases(status?: string): Promise<AIStudentSupportCase[]> {
    if (status && status !== 'All') {
      return this.supportCases.filter((c) => c.supportStatus.toLowerCase() === status.toLowerCase());
    }
    return [...this.supportCases];
  }

  async updateSupportCase(id: string, updateData: Partial<AIStudentSupportCase>): Promise<AIStudentSupportCase | null> {
    const idx = this.supportCases.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.supportCases[idx],
      ...updateData,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    this.supportCases[idx] = updated;
    return { ...updated };
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return [...this.announcements];
  }

  async createAnnouncement(announcementData: Omit<Announcement, 'id'>): Promise<Announcement> {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ANN_${Date.now()}`,
      date: announcementData.date || new Date().toISOString().split('T')[0],
    };
    this.announcements.unshift(newAnnouncement);
    return newAnnouncement;
  }

  async getReports(): Promise<StaffReportSummary[]> {
    return [...this.reports];
  }
}

export const staffRepository = new MockStaffRepository();
