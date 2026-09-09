import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
  CalendarCheck, BookOpen, Code2, Briefcase, Sparkles, ChevronRight,
  CheckCircle, Clock, Flame, TrendingUp, ExternalLink,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChartCard } from '../components/ui/ChartCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { summaryStats, upcomingEvents } from '../data/studentData';
import { performanceTrend } from '../data/academicData';
import { codingPlatforms } from '../data/codingData';

import { useAuth } from '../context/AuthContext';

const subjectColors: Record<string, string> = {
  dataStructures: '#6366F1',
  dbms: '#8B5CF6',
  os: '#06B6D4',
  cn: '#F59E0B',
};

const taskCards = [
  {
    id: 1,
    title: 'Operating Systems Assignment',
    category: 'Assignment',
    due: 'Due Today',
    progress: 70,
    color: 'warning',
    badge: 'warning' as const,
    icon: <BookOpen size={16} />,
    cta: 'Submit Now',
  },
  {
    id: 2,
    title: 'Complete 3 LeetCode Problems',
    category: 'Coding Goal',
    due: '1 of 3 done',
    progress: 33,
    color: 'brand',
    badge: 'brand' as const,
    icon: <Code2 size={16} />,
    cta: 'Start Coding',
  },
  {
    id: 3,
    title: 'Resume Profile',
    category: 'Placement',
    due: 'Complete skills section',
    progress: 90,
    color: 'success',
    badge: 'success' as const,
    icon: <Briefcase size={16} />,
    cta: 'View Resume',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export const Dashboard: React.FC = () => {
  const { student } = useAuth();
  const [activeSubjects, setActiveSubjects] = useState({
    dataStructures: true,
    dbms: true,
    os: true,
    cn: true,
  });
  const [aiDismissed, setAiDismissed] = useState(false);

  const attendanceDonut = [
    { name: 'Present', value: 92.4 },
    { name: 'Absent', value: 7.6 },
  ];

  const toggleSubject = (key: string) => {
    setActiveSubjects((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {student.firstName || student.name.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Here's your academic and career overview for {student.department}.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200/80 shadow-xs rounded-xl px-3.5 py-2">
          <CalendarCheck size={15} className="text-indigo-600" />
          <span className="font-semibold text-slate-700">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Attendance */}
        <StatCard
          title="Attendance"
          value={`${summaryStats.attendance.percentage}%`}
          subtitle="Good Standing"
          trend="+2.1% this month"
          trendPositive
          icon={<CalendarCheck size={18} />}
          accentColor="bg-cyan-50 text-cyan-600 border border-cyan-200/80"
        >
          <ProgressRing percentage={92.4} size={64} strokeWidth={5} color="#06B6D4" trackColor="#ECFEFF" className="mx-auto mt-1">
            <span className="text-[10px] font-extrabold text-cyan-700">92%</span>
          </ProgressRing>
        </StatCard>

        {/* Academics */}
        <StatCard
          title="Academic Performance"
          value="8.4 CGPA"
          subtitle="↑ 0.3 this semester"
          icon={<BookOpen size={18} />}
          accentColor="bg-indigo-50 text-indigo-600 border border-indigo-200/80"
        >
          <div className="h-10 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{v:7.8},{v:8.1},{v:8.0},{v:8.3},{v:8.7}]} margin={{top:2,right:0,left:0,bottom:0}}>
                <Line type="monotone" dataKey="v" stroke="#6366F1" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StatCard>

        {/* Coding */}
        <StatCard
          title="Coding Progress"
          value="248 Problems"
          subtitle="12 solved this week"
          icon={<Code2 size={18} />}
          accentColor="bg-amber-50 text-amber-600 border border-amber-200/80"
        >
          <div className="flex items-center gap-1.5 mt-1">
            <Flame size={15} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-700">18 day streak</span>
          </div>
        </StatCard>

        {/* Placement */}
        <StatCard
          title="Placement Readiness"
          value="78%"
          subtitle="Good Progress"
          icon={<Briefcase size={18} />}
          accentColor="bg-purple-50 text-purple-600 border border-purple-200/80"
        >
          <ProgressBar percentage={78} height={6} color="#8B5CF6" trackColor="#F5F3FF" className="mt-2" />
        </StatCard>
      </motion.div>

      {/* AI Insight */}
      {/* AI Insight */}
      {!aiDismissed && (
        <motion.div variants={item}>
          <div className="card p-5 border-l-4 border-indigo-600 bg-gradient-to-r from-indigo-50/70 via-white to-white border-t border-r border-b border-slate-200/80">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20 text-white">
                <Sparkles size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-slate-900">AI Study Assistant</h3>
                  <Badge variant="brand" size="sm">AI INSIGHT</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  Your attendance is strong, but <span className="font-bold text-slate-900">Data Structures</span> performance
                  has dropped <span className="text-rose-600 font-bold">8%</span> over the last two assessments.
                </p>
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Recommended actions</p>
                  <ul className="space-y-1.5">
                    {[
                      'Practice 5 medium-level DSA problems today',
                      'Review Trees and Graphs chapter',
                      'Attend the upcoming DSA revision session',
                    ].map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                        <span className="w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5 shadow-xs">
                          {i + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">
                    View Study Plan <ChevronRight size={13} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setAiDismissed(true)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Today's Priorities */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">Today's Priorities</h3>
          <Badge variant="neutral">{taskCards.length} tasks</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskCards.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -2 }}
              className="card p-4 cursor-pointer hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  task.badge === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200/80' :
                  task.badge === 'brand' ? 'bg-indigo-50 text-indigo-600 border-indigo-200/80' :
                  'bg-emerald-50 text-emerald-600 border-emerald-200/80'
                }`}>
                  {task.icon}
                </div>
                <Badge variant={task.badge} size="sm">{task.category}</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{task.title}</h4>
              <p className="text-xs text-slate-500 font-medium mb-3">{task.due}</p>
              <ProgressBar
                percentage={task.progress}
                height={6}
                color={task.badge === 'warning' ? '#F59E0B' : task.badge === 'brand' ? '#6366F1' : '#10B981'}
                trackColor={task.badge === 'warning' ? '#FFFBEB' : task.badge === 'brand' ? '#EEF2FF' : '#ECFDF5'}
                showLabel
              />
              <Button variant="secondary" size="sm" className="w-full mt-3">
                {task.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart */}
        <ChartCard
          title="Academic Performance"
          subtitle="Score trends across subjects"
          className="lg:col-span-2"
          action={
            <div className="flex flex-wrap gap-1.5">
              {Object.entries({ dataStructures: 'DSA', dbms: 'DBMS', os: 'OS', cn: 'CN' }).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleSubject(key)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
                    activeSubjects[key as keyof typeof activeSubjects]
                      ? 'border-transparent text-white shadow-xs'
                      : 'border-slate-200 text-slate-400 bg-white'
                  }`}
                  style={activeSubjects[key as keyof typeof activeSubjects] ? { backgroundColor: subjectColors[key] } : {}}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="assessment" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                {activeSubjects.dataStructures && (
                  <Line type="monotone" dataKey="dataStructures" stroke={subjectColors.dataStructures} strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2 }} name="DSA" />
                )}
                {activeSubjects.dbms && (
                  <Line type="monotone" dataKey="dbms" stroke={subjectColors.dbms} strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2 }} name="DBMS" />
                )}
                {activeSubjects.os && (
                  <Line type="monotone" dataKey="os" stroke={subjectColors.os} strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2 }} name="OS" />
                )}
                {activeSubjects.cn && (
                  <Line type="monotone" dataKey="cn" stroke={subjectColors.cn} strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2 }} name="CN" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Donut Chart */}
        <ChartCard title="Attendance Overview" subtitle="Current semester">
          <div className="flex flex-col items-center">
            <div className="h-40">
              <ResponsiveContainer width={160} height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill="#6366F1" />
                    <Cell fill="#EEF2FF" />
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-2">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">92.4%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Present rate</p>
            </div>
            <div className="w-full mt-3 p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-center">
              <p className="text-xs text-indigo-900 font-bold">Min required: 75%</p>
              <p className="text-xs text-indigo-700 font-semibold mt-0.5">✅ Safely above threshold</p>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* Coding Activity & Upcoming */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Coding Platforms */}
        <div>
          <h3 className="section-title mb-3">Coding Activity</h3>
          <div className="grid grid-cols-2 gap-3">
            {codingPlatforms.map((p) => (
              <motion.div
                key={p.name}
                whileHover={{ y: -2 }}
                className="card p-4 hover:border-slate-300 transition-all"
                style={{ borderTop: `3px solid ${p.color}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ color: p.color, backgroundColor: p.bgColor }}
                  >
                    {p.name}
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </div>
                <p className="text-lg font-extrabold text-slate-900">
                  {p.name === 'GitHub' ? `${p.contributions}` : `${p.solved}`}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {p.name === 'GitHub' ? 'contributions' : 'problems solved'}
                </p>
                <p className="text-xs text-emerald-600 font-bold mt-1">+{p.monthlyGain} this month</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="section-title mb-3">Upcoming</h3>
          <div className="card divide-y divide-slate-100 overflow-hidden">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={i}
                whileHover={{ backgroundColor: '#F8FAFC' }}
                className="flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors"
              >
                <div className="text-center w-12 flex-shrink-0">
                  <p className="text-xs text-slate-400 font-semibold">{event.date.split(' ')[0]}</p>
                  <p className="text-lg font-extrabold text-slate-900 leading-tight">{event.date.split(' ')[1]}</p>
                </div>
                <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{event.event}</p>
                  <p className="text-xs text-slate-500 mt-0.5 capitalize font-medium">{event.type}</p>
                </div>
                <span className="text-lg">{event.icon}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
