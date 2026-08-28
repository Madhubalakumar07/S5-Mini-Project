import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts';
import {
  BookOpen, TrendingUp, AlertTriangle, CheckCircle, Clock, ChevronRight,
  Target, Zap,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChartCard } from '../components/ui/ChartCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  subjectScores, performanceTrend, weakSubjects, studyPlan, examReadinessBreakdown,
} from '../data/academicData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const subjectBarColors = ['#006747', '#8CAB18', '#F89F1B', '#EF4444', '#006747'];

export const Academics: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<Set<string>>(
    new Set(['MON', 'TUE'])
  );

  const toggleDay = (day: string) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-charcoal">Academic Analytics</h2>
        <p className="text-gray-500 text-sm mt-1">Understand your performance and improve your weak areas.</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CGPA" value="8.4" subtitle="Overall cumulative" icon={<BookOpen size={18} />} trend="+0.3 this sem" />
        <StatCard title="Semester GPA" value="8.7" subtitle="Current semester" icon={<TrendingUp size={18} />} trend="+0.4 vs last" />
        <StatCard title="Average Internal" value="84%" subtitle="All subjects" icon={<Target size={18} />} />
        <StatCard title="Exam Readiness" value="81%" subtitle="Overall readiness" icon={<Zap size={18} />} trend="+3% this week" />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subject Performance Bar Chart */}
        <ChartCard title="Subject Performance" subtitle="Internal assessment scores">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectScores} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={(v) => v.split(' ')[0]}
                />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                  formatter={(v) => [`${v}%`, 'Score']}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {subjectScores.map((_, i) => (
                    <Cell key={i} fill={subjectBarColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Semester Trend */}
        <ChartCard title="Assessment Performance Trend" subtitle="Across all subjects">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="assessment" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="dataStructures" stroke="#006747" strokeWidth={2} dot={{ r: 3 }} name="DSA" />
                <Line type="monotone" dataKey="dbms" stroke="#8CAB18" strokeWidth={2} dot={{ r: 3 }} name="DBMS" />
                <Line type="monotone" dataKey="os" stroke="#F89F1B" strokeWidth={2} dot={{ r: 3 }} name="OS" />
                <Line type="monotone" dataKey="cn" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="CN" />
                <Line type="monotone" dataKey="aiml" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} name="AI&ML" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </motion.div>

      {/* Weak Subjects */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-amber-500" />
          <h3 className="section-title">Areas That Need Attention</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakSubjects.map((ws) => (
            <div key={ws.subject} className="card p-5 border-l-4 border-amber-400">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-charcoal">{ws.subject}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-amber-600">{ws.score}%</span>
                    <Badge variant="warning" size="sm">{ws.status}</Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} className="text-amber-500" />
                </div>
              </div>
              <ProgressBar percentage={ws.score} height={6} color="#F59E0B" trackColor="#FEF3C7" className="mb-3" />
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">🤖 AI Recommendation</p>
                <p className="text-xs text-gray-600 leading-relaxed">{ws.recommendation}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ws.topics.map((t) => (
                    <span key={t} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">{t}</span>
                  ))}
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Start Study Plan <ChevronRight size={13} />
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Exam Readiness + Study Plan */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Exam Readiness */}
        <div className="card p-6">
          <h3 className="font-semibold text-charcoal mb-4">Exam Readiness</h3>
          <div className="flex flex-col items-center mb-5">
            <ProgressRing percentage={81} size={120} strokeWidth={9}>
              <div className="text-center">
                <p className="text-2xl font-bold text-charcoal">81%</p>
                <p className="text-xs text-gray-400">Ready</p>
              </div>
            </ProgressRing>
          </div>
          <div className="space-y-3">
            {examReadinessBreakdown.map((b) => (
              <div key={b.label}>
                <ProgressBar
                  percentage={b.value}
                  label={b.label}
                  showLabel
                  height={6}
                  color={b.value >= 85 ? '#006747' : b.value >= 75 ? '#8CAB18' : '#F59E0B'}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-brand-50 rounded-xl">
            <p className="text-xs text-brand-700 leading-relaxed">
              💡 You're on track! Improving <strong>coding/practice consistency</strong> can raise your readiness score by ~5%.
            </p>
          </div>
        </div>

        {/* AI Study Plan */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">AI Study Plan</h3>
            <Badge variant="brand">This Week</Badge>
          </div>
          <div className="space-y-2.5">
            {studyPlan.map((day) => {
              const done = completedDays.has(day.day);
              return (
                <motion.div
                  key={day.day}
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    done ? 'bg-brand-50 border-brand-100' : 'bg-gray-50 border-gray-100 hover:border-brand-100'
                  }`}
                  onClick={() => toggleDay(day.day)}
                >
                  <button
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      done ? 'bg-brand-500 border-brand-500' : 'border-gray-300 hover:border-brand-400'
                    }`}
                    aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {done && <CheckCircle size={12} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-8">{day.day}</span>
                      <span className={`text-sm font-medium ${done ? 'line-through text-gray-400' : 'text-charcoal'}`}>
                        {day.subject}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    <span>{day.duration} min</span>
                  </div>
                  <Badge
                    variant={day.type === 'mock' ? 'danger' : day.type === 'practice' ? 'brand' : 'neutral'}
                    size="sm"
                  >
                    {day.type}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            {completedDays.size} of {studyPlan.length} sessions completed
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


