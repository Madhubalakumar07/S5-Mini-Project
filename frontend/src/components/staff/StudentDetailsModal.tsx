import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone,
  User,
  Award,
  Building2,
  ExternalLink,
  ShieldAlert,
  Clock,
  Layers,
} from 'lucide-react';
import { StaffStudentSummary } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface StudentDetailsModalProps {
  student: StaffStudentSummary | null;
  onClose: () => void;
  initialTab?: 'overview' | 'academics' | 'attendance' | 'placement' | 'aiSupport';
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  onClose,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'attendance' | 'placement' | 'aiSupport'>(initialTab);

  if (!student) return null;

  const isLowAttendance = student.attendance < 75;
  const isHighRisk = student.riskLevel === 'High';
  const isMedRisk = student.riskLevel === 'Medium';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Top Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white/20 flex-shrink-0">
                  {student.avatarInitials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black tracking-tight">{student.name}</h2>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/15 border border-white/10 text-indigo-200">
                      {student.rollNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {student.department} · {student.year}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                    <a href={`mailto:${student.email}`} className="flex items-center gap-1 hover:text-white transition-colors">
                      <Mail size={12} className="text-indigo-400" />
                      <span>{student.email}</span>
                    </a>
                    <a href={`tel:${student.phone}`} className="flex items-center gap-1 hover:text-white transition-colors">
                      <Phone size={12} className="text-indigo-400" />
                      <span>{student.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Capacity / Advisor Tag */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                  Assigned Cohort Student (Max Capacity: 20 per Staff)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                    isHighRisk
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
                      : isMedRisk
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  }`}
                >
                  {isHighRisk ? '🔴 High Risk' : isMedRisk ? '🟠 Medium Risk' : '🟢 Low Risk'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isLowAttendance
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  Attendance: {student.attendance}%
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 bg-white/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User size={14} />
              Overview & Risk
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academics')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'academics'
                  ? 'border-indigo-600 text-indigo-600 bg-white/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap size={14} />
              Academics & Marks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'attendance'
                  ? 'border-indigo-600 text-indigo-600 bg-white/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarCheck size={14} />
              Attendance Breakdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('placement')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'placement'
                  ? 'border-indigo-600 text-indigo-600 bg-white/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase size={14} />
              Placement & Skills
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* ─── TAB 1: OVERVIEW ─── */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">CGPA Score</span>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{student.cgpa}</p>
                    <span className="text-[11px] text-slate-500 font-medium">Class Rank Avg: 8.0</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Academic Avg</span>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{student.academicScore}%</p>
                    <span className="text-[11px] text-slate-500 font-medium">Internals & Tests</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl border ${
                      isLowAttendance ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-200'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isLowAttendance ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Attendance
                    </span>
                    <p className={`text-xl font-black mt-0.5 ${isLowAttendance ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {student.attendance}%
                    </p>
                    <span className="text-[11px] text-slate-500 font-medium">{isLowAttendance ? 'Deficit < 75%' : 'Regular'}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-violet-50/50 border border-violet-100">
                    <span className="text-[10px] uppercase font-bold text-violet-600 tracking-wider">Placement Status</span>
                    <p className="text-sm font-black text-slate-900 mt-1 truncate">
                      {student.placementStatus || 'Seeking'}
                    </p>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {student.company ? `${student.company}` : 'Registered'}
                    </span>
                  </div>
                </div>

                {/* AI Insight Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 border border-indigo-100/80 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <Sparkles size={14} />
                    </div>
                    <span>CampusAI Diagnostic Summary</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {student.aiInsight}
                  </p>
                  <div className="pt-2 border-t border-indigo-100/60 flex items-start gap-2 text-xs">
                    <span className="font-bold text-indigo-900 flex-shrink-0">Action Plan:</span>
                    <span className="text-slate-600 font-medium">{student.recommendedAction}</span>
                  </div>
                </div>

                {/* Quick Profile Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <User size={13} className="text-indigo-600" />
                      Student Information
                    </h4>
                    <div className="space-y-1.5 text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Roll / Register No:</span>
                        <span className="font-mono font-bold text-slate-900">{student.rollNumber}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Department:</span>
                        <span className="font-semibold text-slate-900">{student.department}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Semester:</span>
                        <span className="font-semibold text-slate-900">{student.year}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Staff Advisor:</span>
                        <span className="font-semibold text-indigo-600">Dr. Priya Sharma</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Briefcase size={13} className="text-indigo-600" />
                      Placement & Career Quick View
                    </h4>
                    <div className="space-y-1.5 text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Eligibility:</span>
                        <span className="font-bold text-slate-900">{student.placementEligibility || 'Eligible'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Application Status:</span>
                        <span className="font-semibold text-slate-900">{student.applicationStatus || 'Applied'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span>Placement Status:</span>
                        <span className="font-bold text-indigo-600">{student.placementStatus || 'Seeking'}</span>
                      </div>
                      {student.company && (
                        <div className="flex justify-between py-1">
                          <span>Offered Company:</span>
                          <span className="font-bold text-emerald-700">
                            {student.company} {student.ctc && `(${student.ctc})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 2: ACADEMICS & MARKS ─── */}
            {activeTab === 'academics' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Current Semester Academic Index</h4>
                    <p className="text-[11px] text-slate-500">Continuous Assessment & Internal Marks</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Overall: <strong className="text-indigo-600">{student.academicScore}%</strong></span>
                    <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-xl text-xs font-black">CGPA {student.cgpa}</span>
                  </div>
                </div>

                {/* Subject Scores Grid */}
                {student.subjectScores && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-indigo-600" />
                      Subject-Wise Assessment Scores
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(student.subjectScores).map(([subj, data]) => {
                        const isDistinction = data.grade === 'O' || data.grade === 'A+';
                        const isLow = data.marks < 60;

                        return (
                          <div key={subj} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{subj}</h5>
                                <p className="text-[10px] text-slate-400">Internal Assessment 1 & 2</p>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-black ${
                                  isDistinction
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isLow
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                Grade {data.grade}
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between pt-1">
                              <span className="text-lg font-black text-slate-900">{data.marks} <span className="text-xs font-medium text-slate-400">/ {data.maxMarks}</span></span>
                              <span className="text-xs font-semibold text-slate-500">{((data.marks / data.maxMarks) * 100).toFixed(0)}%</span>
                            </div>

                            <ProgressBar
                              percentage={(data.marks / data.maxMarks) * 100}
                              color={isDistinction ? '#10B981' : isLow ? '#F43F5E' : '#6366F1'}
                              height={5}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 3: ATTENDANCE BREAKDOWN ─── */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                {/* Overall Attendance Warning or Good Banner */}
                {isLowAttendance ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                    <AlertTriangle className="text-rose-600 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-xs">
                      <p className="font-bold text-rose-900">Attendance Below Mandatory 75% Statutory Limit</p>
                      <p className="text-rose-700 mt-0.5">
                        Current cumulative attendance is <strong className="font-extrabold">{student.attendance}%</strong>. Student requires immediate counseling and extra makeup sessions to qualify for semester university examinations.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-xs">
                      <p className="font-bold text-emerald-900">Satisfactory Attendance Record</p>
                      <p className="text-emerald-700 mt-0.5">
                        Current cumulative attendance is <strong className="font-extrabold">{student.attendance}%</strong> (meets institutional requirements).
                      </p>
                    </div>
                  </div>
                )}

                {/* Subject Attendance Breakdown List */}
                {student.subjectAttendance && (
                  <div className="card p-4 sm:p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarCheck size={14} className="text-indigo-600" />
                      Detailed Course-Wise Attendance
                    </h4>

                    <div className="space-y-3.5">
                      {Object.entries(student.subjectAttendance).map(([subj, data]) => {
                        const isSubjLow = data.percentage < 75;
                        return (
                          <div key={subj} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800">{subj}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-medium">
                                  {data.attended} / {data.total} Hours
                                </span>
                                <span className={`font-black ${isSubjLow ? 'text-rose-600' : 'text-slate-900'}`}>
                                  {data.percentage}%
                                </span>
                              </div>
                            </div>
                            <ProgressBar
                              percentage={data.percentage}
                              color={isSubjLow ? '#F43F5E' : '#6366F1'}
                              height={6}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 4: PLACEMENT & SKILLS ─── */}
            {activeTab === 'placement' && (
              <div className="space-y-5">
                {/* Placement Offer Banner */}
                {student.company ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                        <Award size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Campus Offer Secured</span>
                        <h4 className="text-base font-extrabold text-slate-900">{student.company}</h4>
                        <p className="text-xs text-slate-500">Drive Date: {student.driveDate || 'July/Aug 2026'}</p>
                      </div>
                    </div>
                    {student.ctc && (
                      <div className="sm:text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Offered Package</span>
                        <span className="text-lg font-black text-indigo-600">{student.ctc}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">Actively Seeking Opportunities</h4>
                      <p className="text-slate-500 mt-0.5">Eligibility: <strong className="text-slate-800">{student.placementEligibility || 'Eligible'}</strong></p>
                    </div>
                    <Badge variant={student.placementStatus === 'In Process' ? 'brand' : 'neutral'}>
                      {student.placementStatus || 'Seeking Placement'}
                    </Badge>
                  </div>
                )}

                {/* Skills Section */}
                <div className="card p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-indigo-600" />
                    Verified Technical Skills & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(student.skills || ['Java', 'Python', 'SQL', 'Data Structures', 'Git']).map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Placement Details Summary Table */}
                <div className="card p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Placement Roster Audit</h4>
                  <div className="divide-y divide-slate-100 text-slate-600">
                    <div className="py-2 flex justify-between">
                      <span>Placement Eligibility Status:</span>
                      <span className="font-bold text-slate-900">{student.placementEligibility || 'Eligible'}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span>Drive Application Status:</span>
                      <span className="font-bold text-slate-900">{student.applicationStatus || 'Applied'}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span>Placement Classification:</span>
                      <span className="font-bold text-indigo-600">{student.placementStatus || 'Seeking'}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span>Academic CGPA Benchmark:</span>
                      <span className="font-bold text-slate-900">{student.cgpa} / 10.0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Roll No: <strong className="text-slate-700">{student.rollNumber}</strong>
            </span>
            <Button variant="primary" size="sm" onClick={onClose}>
              Close Details
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
