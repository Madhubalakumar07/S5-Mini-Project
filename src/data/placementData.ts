import type { PlacementBreakdown, CareerRoadmapStep, Company, ResumeItem } from '../types';

export const placementScore = {
  score: 78,
  maxScore: 100,
  status: 'Good Progress',
  trend: '+5 this month',
};

export const placementBreakdown: PlacementBreakdown[] = [
  { label: 'Technical Skills', value: 82, icon: '⚙️' },
  { label: 'Coding', value: 74, icon: '💻' },
  { label: 'Communication', value: 68, icon: '🗣️' },
  { label: 'Resume', value: 90, icon: '📄' },
  { label: 'Interview Preparation', value: 71, icon: '🎯' },
];

export const careerRoadmap: CareerRoadmapStep[] = [
  { step: 1, title: 'Resume', progress: 100, completed: true, description: 'Professional resume with all key sections' },
  { step: 2, title: 'DSA Preparation', progress: 72, completed: false, description: '248/345 problems solved across platforms' },
  { step: 3, title: 'Core CS Subjects', progress: 65, completed: false, description: 'OS, Networks, DBMS, Algorithms' },
  { step: 4, title: 'Aptitude', progress: 58, completed: false, description: 'Quantitative, Verbal, and Logical reasoning' },
  { step: 5, title: 'Mock Interviews', progress: 40, completed: false, description: '2/5 mock interviews completed' },
  { step: 6, title: 'Placement Applications', progress: 25, completed: false, description: 'Applied to 3 out of target 12 companies' },
];

export const recommendedCompanies: Company[] = [
  {
    name: 'TCS',
    logo: 'TCS',
    matchPercentage: 92,
    skillsMatched: 8,
    totalSkills: 9,
    ctc: '3.36 LPA',
    roles: ['Software Engineer', 'System Engineer'],
    color: '#004B8D',
  },
  {
    name: 'Infosys',
    logo: 'INFY',
    matchPercentage: 88,
    skillsMatched: 7,
    totalSkills: 9,
    ctc: '3.60 LPA',
    roles: ['Systems Engineer', 'Associate'],
    color: '#007CC3',
  },
  {
    name: 'Accenture',
    logo: 'ACN',
    matchPercentage: 84,
    skillsMatched: 7,
    totalSkills: 9,
    ctc: '4.50 LPA',
    roles: ['Associate Software Engineer'],
    color: '#A100FF',
  },
  {
    name: 'Zoho',
    logo: 'ZHO',
    matchPercentage: 78,
    skillsMatched: 6,
    totalSkills: 9,
    ctc: '5.00 LPA',
    roles: ['Software Developer', 'Member Technical Staff'],
    color: '#E42527',
  },
];

export const resumeChecklist: ResumeItem[] = [
  { label: 'Personal Information', completed: true },
  { label: 'Education Details', completed: true },
  { label: 'Technical Skills', completed: true },
  { label: 'Projects (3 listed)', completed: true },
  { label: 'Coding Profiles', completed: true },
  { label: 'Certifications', completed: true },
  { label: 'Achievements & Awards', completed: false },
];

export const mockInterview = {
  type: 'Technical Interview',
  date: 'August 18, 2026',
  time: '11:00 AM',
  interviewer: 'AI Practice Interview',
  topics: ['Data Structures', 'Algorithms', 'System Design Basics'],
};
