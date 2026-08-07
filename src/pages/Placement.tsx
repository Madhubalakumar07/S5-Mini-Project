import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  Briefcase, Code2, FileText, Star, ChevronRight, CheckCircle,
  Circle, ExternalLink, Calendar, Clock, Zap, Trophy,
} from 'lucide-react';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { StatCard } from '../components/ui/StatCard';
import {
  placementScore, placementBreakdown, careerRoadmap,
  recommendedCompanies, resumeChecklist, mockInterview,
} from '../data/placementData';
import { codingPlatforms } from '../data/codingData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const radarData = placementBreakdown.map((b) => ({
  subject: b.label.length > 12 ? b.label.substring(0, 10) + '…' : b.label,
  A: b.value,
}));

export const Placement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'applied'>('all');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-charcoal">Placement Readiness</h2>
        <p className="text-gray-500 text-sm mt-1">Build the skills, resume, and confidence you need for your target companies.</p>
      </motion.div>

      {/* Hero — Placement Score */}
      <motion.div variants={item}>
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Score Ring */}
            <div className="flex flex-col items-center lg:items-start gap-3">
              <ProgressRing percentage={78} size={140} strokeWidth={10}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-charcoal">78</p>
                  <p className="text-xs text-gray-400">/ 100</p>
                </div>
              </ProgressRing>
              <div className="text-center lg:text-left">
                <p className="text-sm font-semibold text-charcoal">Placement Readiness Score</p>
                <Badge variant="success">Good Progress ↑+5 this month</Badge>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-3">Skill Breakdown</p>
              <div className="space-y-3">
                {placementBreakdown.map((b) => (
                  <ProgressBar
                    key={b.label}
                    percentage={b.value}
                    label={`${b.icon} ${b.label}`}
                    showLabel
                    height={7}
                    color={b.value >= 80 ? '#006747' : b.value >= 70 ? '#8CAB18' : '#F59E0B'}
                  />
                ))}
              </div>
            </div>

            {/* Radar */}
            <div className="w-full lg:w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                  <Radar dataKey="A" stroke="#006747" fill="#006747" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Career Roadmap */}
      <motion.div variants={item}>
        <h3 className="section-title mb-4">Career Roadmap</h3>
        {/* Desktop horizontal */}
        <div className="hidden md:block card p-6">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-100 z-0">
              <div className="h-full bg-brand-500" style={{ width: '30%' }} />
            </div>
            <div className="grid grid-cols-6 gap-2 relative z-10">
              {careerRoadmap.map((step) => (
                <div key={step.step} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.completed
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : step.progress > 0
                      ? 'bg-white border-brand-300 text-brand-500'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="text-sm font-bold">{step.step}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-charcoal">{step.title}</p>
                    {step.completed ? (
                      <Badge variant="success" size="sm">✓ Done</Badge>
                    ) : (
                      <p className="text-xs text-brand-600 font-medium">{step.progress}%</p>
                    )}
                  </div>
                  {!step.completed && <ProgressBar percentage={step.progress} height={3} className="w-full" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden card p-4 space-y-3">
          {careerRoadmap.map((step, i) => (
            <div key={step.step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                  step.completed ? 'bg-brand-500 border-brand-500 text-white' :
                  step.progress > 0 ? 'border-brand-300 text-brand-500' : 'border-gray-200 text-gray-400'
                }`}>
                  {step.completed ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{step.step}</span>}
                </div>
                {i < careerRoadmap.length - 1 && <div className="w-0.5 h-6 bg-gray-100 mt-1" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-charcoal">{step.title}</p>
                  {step.completed ? <Badge variant="success" size="sm">Done</Badge> : <span className="text-xs text-brand-600">{step.progress}%</span>}
                </div>
                <p className="text-xs text-gray-500">{step.description}</p>
                {!step.completed && <ProgressBar percentage={step.progress} height={4} className="mt-2" />}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Coding Profiles */}
      <motion.div variants={item}>
        <h3 className="section-title mb-3">Coding Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {codingPlatforms.map((p) => (
            <motion.div
              key={p.name}
              whileHover={{ y: -2 }}
              className="card p-4"
              style={{ borderTop: `3px solid ${p.color}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                <button className="text-gray-300 hover:text-gray-500 transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>
              <p className="text-xl font-bold text-charcoal mb-0.5">
                {p.name === 'GitHub' ? p.contributions : p.solved}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {p.name === 'GitHub' ? 'contributions' : 'problems solved'}
              </p>
              {p.rating && <p className="text-xs text-gray-600">Rating: <span className="font-semibold">{p.rating}</span></p>}
              {p.streak && (
                <p className="text-xs text-orange-600">🔥 {p.streak} day streak</p>
              )}
              {p.stars && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: p.stars }).map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              )}
              {p.repositories && <p className="text-xs text-gray-600">{p.repositories} repositories</p>}
              <Button variant="outline" size="sm" className="w-full mt-3">
                View Profile
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Companies + Resume + Mock */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Companies */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Recommended Companies</h3>
            <p className="text-xs text-gray-400">Based on your profile · Not real-time hiring data</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendedCompanies.map((company) => (
              <motion.div key={company.name} whileHover={{ y: -2 }} className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: company.color }}
                  >
                    {company.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-charcoal text-sm">{company.name}</p>
                    <p className="text-xs text-gray-500 truncate">{company.roles[0]}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500">Match Score</p>
                    <p className="text-lg font-bold text-brand-600">{company.matchPercentage}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Skills Matched</p>
                    <p className="text-sm font-semibold text-charcoal">
                      {company.skillsMatched}/{company.totalSkills}
                    </p>
                  </div>
                </div>
                <ProgressBar
                  percentage={company.matchPercentage}
                  height={5}
                  color={company.matchPercentage >= 90 ? '#006747' : company.matchPercentage >= 80 ? '#8CAB18' : '#F59E0B'}
                  className="mb-3"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">CTC: <span className="font-medium text-charcoal">{company.ctc}</span></span>
                  <Button variant="secondary" size="sm">
                    Prep Plan <ChevronRight size={12} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resume + Mock */}
        <div className="space-y-4">
          {/* Resume Card */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <FileText size={18} className="text-brand-500" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal text-sm">Resume Completeness</h3>
                <p className="text-xs text-gray-400">Last updated 3 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <ProgressRing percentage={90} size={56} strokeWidth={5}>
                <span className="text-xs font-bold text-brand-600">90%</span>
              </ProgressRing>
              <div className="flex-1">
                <ProgressBar percentage={90} height={6} />
                <p className="text-xs text-gray-500 mt-1">1 section remaining</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {resumeChecklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle size={14} className="text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="primary" size="sm" className="w-full">
              Improve Resume
            </Button>
          </div>

          {/* Mock Interview */}
          <div className="card p-5 border-2 border-brand-100">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={18} className="text-brand-500" />
              <h3 className="font-semibold text-charcoal text-sm">Next Mock Interview</h3>
            </div>
            <div className="bg-brand-50 rounded-xl p-3 mb-3">
              <p className="text-sm font-semibold text-brand-700">{mockInterview.type}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Calendar size={12} className="text-brand-400" />
                <span className="text-xs text-brand-600">{mockInterview.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={12} className="text-brand-400" />
                <span className="text-xs text-brand-600">{mockInterview.time}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Interviewer</p>
            <p className="text-xs font-medium text-charcoal mb-3">{mockInterview.interviewer}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {mockInterview.topics.map((t) => (
                <span key={t} className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">{t}</span>
              ))}
            </div>
            <Button variant="primary" size="sm" className="w-full">
              Prepare Now <Zap size={13} />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
