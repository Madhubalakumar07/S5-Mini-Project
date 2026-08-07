import type { CodingPlatform, CodingActivityMonth } from '../types';

export const codingPlatforms: CodingPlatform[] = [
  {
    name: 'LeetCode',
    username: 'arun_kumar_cs',
    solved: 124,
    monthlyGain: 8,
    rating: 1542,
    streak: 18,
    color: '#F89F1B',
    bgColor: '#FFF7ED',
    url: '#',
  },
  {
    name: 'HackerRank',
    username: 'arun_kumar',
    solved: 76,
    monthlyGain: 5,
    stars: 5,
    color: '#00EA64',
    bgColor: '#F0FDF4',
    url: '#',
  },
  {
    name: 'CodeChef',
    username: 'arun2026',
    solved: 32,
    monthlyGain: 4,
    rating: 1320,
    color: '#5B4638',
    bgColor: '#FDF8F5',
    url: '#',
  },
  {
    name: 'GitHub',
    username: 'arunkumar-cs',
    solved: 42,
    monthlyGain: 12,
    contributions: 42,
    repositories: 8,
    color: '#24292F',
    bgColor: '#F6F8FA',
    url: '#',
  },
];

export const codingActivity: CodingActivityMonth[] = [
  { month: 'Mar', problems: 18 },
  { month: 'Apr', problems: 24 },
  { month: 'May', problems: 20 },
  { month: 'Jun', problems: 32 },
  { month: 'Jul', problems: 28 },
  { month: 'Aug', problems: 12 },
];

export const difficultyBreakdown = [
  { name: 'Easy', value: 68, color: '#22C55E' },
  { name: 'Medium', value: 44, color: '#F89F1B' },
  { name: 'Hard', value: 12, color: '#EF4444' },
];

export const topicProgress = [
  { topic: 'Arrays & Strings', solved: 38, total: 50 },
  { topic: 'Trees & Graphs', solved: 22, total: 40 },
  { topic: 'Dynamic Programming', solved: 14, total: 35 },
  { topic: 'Sorting & Searching', solved: 28, total: 30 },
  { topic: 'Recursion & Backtracking', solved: 12, total: 25 },
];
