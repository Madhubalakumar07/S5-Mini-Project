import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  Award,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  staffCohortOverview,
  staffStudentsList,
  initialAnnouncements,
} from '../../data/staffData';
import { useAuth } from '../../context/AuthContext';
import { StaffStudentSummary } from '../../types';
import { StudentDetailsModal } from '../../components/staff/StudentDetailsModal';

const attendanceTrendData = [
  { week: 'W1', rate: 88, cs: 90 },
  { week: 'W2', rate: 85, cs: 87 },
  { week: 'W3', rate: 82, cs: 84 },
  { week: 'W4', rate: 86, cs: 89 },
  { week: 'W5', rate: 89, cs: 91 },
  { week: 'W6', rate: 84, cs: 86 },
  { week: 'W7', rate: 85, cs: 87 },
];

const gradeDistribution = [
  { grade: 'O (90+)', count: 4, fill: '#6366F1' },
  { grade: 'A+ (80-89)', count: 9, fill: '#818CF8' },
  { grade: 'A (70-79)', count: 4, fill: '#A5B4FC' },
  { grade: 'B (60-69)', count: 2, fill: '#F59E0B' },
  { grade: 'Needs Help (<60)', count: 1, fill: '#F43F5E' },
];

export const StaffDashboard: React.FC = () => {
  const { staffProfile } = useAuth();
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StaffStudentSummary | null>(null);

  const lowAttendanceStudents = staffStudentsList.filter((s) => s.attendance < 75);
  const topPerformers = [...staffStudentsList].sort((a, b) => b.academicScore - a.academicScore).slice(0, 4);

  const filteredRiskStudents = staffStudentsList.filter((s) => {
    if (selectedRiskFilter === 'All') return s.riskLevel === 'High' || s.riskLevel === 'Medium';
    return s.riskLevel === selectedRiskFilter;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/10">
              <Sparkles size={13} />
              <span>CampusAI Faculty Copilot Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {getGreeting()}, {staffProfile.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitoring <span className="text-white font-bold">{staffCohortOverview.totalStudents} assigned students</span> (Faculty Limit: {staffCohortOverview.maxCohortCapacity}) in {staffProfile.department}. 
              AI Risk Engine detected <span className="text-amber-300 font-bold">{staffCohortOverview.atRiskStudentsCount} students</span> requiring attendance or academic interventions this week.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/staff/students-attendance">
              <Button variant="primary" size="md" className="flex items-center gap-2 bg-white text-indigo-900 hover:bg-slate-100 shadow-md">
                <CalendarCheck size={16} />
                <span>Mark Attendance</span>
              </Button>
            </Link>
            <Link to="/staff/support-reports">
              <Button variant="outline" size="md" className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10">
                <ShieldAlert size={16} />
                <span>AI Risk Interventions</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Assigned Cohort"
          value={`${staffCohortOverview.totalStudents} Students`}
          subtitle={`Capacity (${staffCohortOverview.totalStudents}/${staffCohortOverview.maxCohortCapacity})`}
          icon={<Users size={18} />}
          trend="20 Limit"
          trendPositive
        />
        <StatCard
          title="Average Attendance"
          value={`${staffCohortOverview.avgAttendance}%`}
          subtitle="Target: ≥75.0%"
          icon={<CalendarCheck size={18} />}
          trend="+1.8% vs last mo"
          trendPositive
        />
        <StatCard
          title="Academic Average"
          value={`${staffCohortOverview.avgAcademicScore}%`}
          subtitle="Class score average"
          icon={<GraduationCap size={18} />}
          trend="Healthy"
          trendPositive
        />
        <StatCard
          title="Placement Rate"
          value={`${staffCohortOverview.placementRate}%`}
          subtitle={`${staffCohortOverview.totalPlaced} of ${staffCohortOverview.eligibleForPlacement} eligible placed`}
          icon={<Briefcase size={18} />}
          trend="Active Season"
          trendPositive
        />
        <StatCard
          title="At-Risk Students"
          value={staffCohortOverview.atRiskStudentsCount}
          subtitle={`${staffCohortOverview.highRiskCount} High · ${staffCohortOverview.mediumRiskCount} Med`}
          icon={<AlertTriangle size={18} />}
          trend="Action Needed"
          trendPositive={false}
        />
      </div>

      {/* 2. Attendance & Academic Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Section (7 cols) */}
        <div className="lg:col-span-7 card p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck size={18} className="text-indigo-600" />
                Attendance Analytics & Low Attendance Alert
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Weekly attendance trend across 20 assigned students</p>
            </div>
            <Link to="/staff/students-attendance" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
              View Register <ArrowRight size={13} />
            </Link>
          </div>

          {/* Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 100]} tickLine={false} unit="%" />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Attendance']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Class Average"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366F1' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="cs"
                  name="CSE Subject Avg"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Low Attendance Alert Row */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-500" />
                Students Below 75% Threshold ({lowAttendanceStudents.length})
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Statutory minimum: 75%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lowAttendanceStudents.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudentForModal(st)}
                  className="p-3 rounded-xl border border-rose-200/80 bg-rose-50/40 flex items-center justify-between gap-3 cursor-pointer hover:bg-rose-50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {st.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600">{st.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{st.rollNumber} · {st.department}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-extrabold text-rose-600 block">{st.attendance}%</span>
                    <span className="text-[10px] text-rose-500 font-semibold">Inspect Profile →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Performance Section (5 cols) */}
        <div className="lg:col-span-5 card p-5 sm:p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap size={18} className="text-indigo-600" />
                  Academic Distribution
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">20 Cohort scores breakdown</p>
              </div>
              <Badge variant="brand">Class Avg: {staffCohortOverview.avgAcademicScore}%</Badge>
            </div>

            {/* Bar chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} layout="vertical">
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} hide />
                  <YAxis dataKey="grade" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" /> Top Performers
              </span>
              <span className="text-[11px] text-slate-400">Score &gt; 85%</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topPerformers.map((tp) => (
                <button
                  type="button"
                  key={tp.id}
                  onClick={() => setSelectedStudentForModal(tp)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {tp.avatarInitials}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{tp.name}</span>
                  <span className="text-xs font-extrabold text-indigo-600">{tp.academicScore}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI Risk Section */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <h2 className="text-base font-bold text-slate-900">AI Student Risk & Early Warning Hub</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Predictive insight combining low attendance patterns, grade trajectories, and assignment latencies.
            </p>
          </div>

          {/* Risk Level Filter Badges */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
            {(['All', 'High', 'Medium', 'Low'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRiskFilter(r)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedRiskFilter === r
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'All' ? 'All Flagged' : `${r} Risk`}
              </button>
            ))}
          </div>
        </div>

        {/* Student Risk Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredRiskStudents.map((student) => {
            const isHigh = student.riskLevel === 'High';
            const isMed = student.riskLevel === 'Medium';

            return (
              <div
                key={student.id}
                className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                  isHigh
                    ? 'bg-rose-50/40 border-rose-200'
                    : isMed
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-emerald-50/40 border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div
                    onClick={() => setSelectedStudentForModal(student)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${
                        isHigh ? 'bg-rose-600' : isMed ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                    >
                      {student.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600">{student.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{student.rollNumber} · {student.department}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isHigh
                        ? 'bg-rose-100 text-rose-700'
                        : isMed
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isHigh ? '🔴 High Risk' : isMed ? '🟠 Medium Risk' : '🟢 Low Risk'}
                  </span>
                </div>

                {/* Score Pills */}
                <div className="grid grid-cols-2 gap-2 my-2.5 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Attendance</span>
                    <span className={`font-bold ${student.attendance < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {student.attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Academic Score</span>
                    <span className={`font-bold ${student.academicScore < 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {student.academicScore}% (CGPA {student.cgpa})
                    </span>
                  </div>
                </div>

                {/* AI Insight */}
                <div className="space-y-1.5 my-2">
                  <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles size={12} className="text-indigo-600" /> AI Insight:
                  </p>
                  <p className="text-xs text-slate-600 leading-snug bg-white/60 p-2 rounded-lg border border-slate-100">
                    {student.aiInsight}
                  </p>
                </div>

                {/* Action Links */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForModal(student)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Eye size={12} />
                    <span>View Profile</span>
                  </button>

                  <Link
                    to="/staff/support-reports"
                    className="text-slate-600 font-bold hover:text-indigo-600 flex items-center gap-0.5 flex-shrink-0"
                  >
                    Intervene <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Full Details Modal */}
      <StudentDetailsModal
        student={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        initialTab="overview"
      />
    </div>
  );
};
