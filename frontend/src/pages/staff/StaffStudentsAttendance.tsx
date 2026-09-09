import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  CalendarCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  X,
  BookOpen,
  Briefcase,
  GraduationCap,
  Save,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  staffStudentsList,
  initialAttendanceSessions,
  staffCohortOverview,
} from '../../data/staffData';
import { StaffStudentSummary } from '../../types';
import { StudentDetailsModal } from '../../components/staff/StudentDetailsModal';

export const StaffStudentsAttendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roster' | 'markAttendance'>('roster');

  // Roster Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StaffStudentSummary | null>(null);

  // Attendance Marking State
  const [attendanceDate, setAttendanceDate] = useState('2026-08-10');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms');
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>(() => {
    const initial: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    initialAttendanceSessions['today_dsa'].entries.forEach((e) => {
      initial[e.studentId] = e.status;
    });
    return initial;
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Filtered Students for Roster
  const filteredStudents = staffStudentsList.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'All' || s.department.includes(selectedDept);
    const matchRisk = selectedRisk === 'All' || s.riskLevel === selectedRisk;
    return matchSearch && matchDept && matchRisk;
  });

  const lowAttendanceCount = staffStudentsList.filter((s) => s.attendance < 75).length;

  const handleToggleAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    staffStudentsList.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceSheet(updated);
  };

  const handleSaveAttendance = () => {
    setSaveSuccessMsg(`Attendance for ${selectedSubject} on ${attendanceDate} saved successfully!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Users size={22} className="text-indigo-600" />
              Students & Attendance Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Staff Cohort: {staffCohortOverview.totalStudents} / {staffCohortOverview.maxCohortCapacity} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage cohort enrollment, mark daily session registers, and track students below 75% attendance.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'roster'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            Student Cohort Roster ({staffStudentsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('markAttendance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'markAttendance'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck size={14} />
            Mark & Update Attendance
          </button>
        </div>
      </div>

      {/* ─── TAB 1: STUDENT ROSTER ──────────────────────────────────────── */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
              >
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>

              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
              >
                <option value="All">All Risk Statuses</option>
                <option value="High">🔴 High Risk</option>
                <option value="Medium">🟠 Medium Risk</option>
                <option value="Low">🟢 Low Risk</option>
              </select>

              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200/80">
                <AlertTriangle size={13} />
                <span>{lowAttendanceCount} Low Attendance (&lt;75%)</span>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Register No</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Attendance</th>
                    <th className="py-3.5 px-4">Academic Score</th>
                    <th className="py-3.5 px-4">Risk Level</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {st.avatarInitials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{st.name}</p>
                            <p className="text-[10px] text-slate-400">{st.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">{st.rollNumber}</td>
                      <td className="py-3 px-4">{st.department}</td>
                      <td className="py-3 px-4">{st.year}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              st.attendance < 75 ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {st.attendance}%
                          </span>
                          {st.attendance < 75 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{st.academicScore}%</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">(CGPA {st.cgpa})</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            st.riskLevel === 'High'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : st.riskLevel === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {st.riskLevel === 'High' ? '🔴 High' : st.riskLevel === 'Medium' ? '🟠 Medium' : '🟢 Low'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedStudentForModal(st)}
                          className="inline-flex items-center gap-1.5 text-xs py-1"
                        >
                          <Eye size={13} />
                          <span>View Details</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No students found matching the selected filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: MARK & UPDATE ATTENDANCE ───────────────────────────── */}
      {activeTab === 'markAttendance' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="card p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Session Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Course</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                  >
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms (CS301)</option>
                    <option value="Database Management Systems">Database Management Systems (CS302)</option>
                    <option value="Operating Systems">Operating Systems (CS303)</option>
                    <option value="Computer Networks">Computer Networks (CS304)</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML (CS501)</option>
                  </select>
                </div>
              </div>

              {/* Batch Actions & Save */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll('Present')}
                  className="text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                >
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Mark All Present
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAll('Absent')}
                  className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  <XCircle size={13} className="text-rose-600" />
                  Mark All Absent
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAttendance}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Save size={13} />
                  Save Register
                </Button>
              </div>
            </div>

            {saveSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold"
              >
                <Check size={16} className="text-emerald-600 flex-shrink-0" />
                <span>{saveSuccessMsg}</span>
              </motion.div>
            )}

            {/* Attendance Sheet */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Cumulative Attendance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Quick Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {staffStudentsList.map((student) => {
                    const status = attendanceSheet[student.id] || 'Present';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{student.name}</td>
                        <td className="py-3 px-4 font-mono">{student.rollNumber}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold ${
                              student.attendance < 75 ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'Absent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleToggleAttendance(student.id, 'Present')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleAttendance(student.id, 'Late')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'Late'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleAttendance(student.id, 'Absent')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Full Details Modal */}
      <StudentDetailsModal
        student={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        initialTab="attendance"
      />
    </div>
  );
};
