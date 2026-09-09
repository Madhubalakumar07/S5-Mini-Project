import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
  Check,
  Eye,
  User,
  Users,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  staffStudentsList,
  staffAcademicMarks,
  staffCohortOverview,
} from '../../data/staffData';
import { AcademicMarkEntry, StaffStudentSummary } from '../../types';
import { StudentDetailsModal } from '../../components/staff/StudentDetailsModal';

const subjectAnalytics = [
  { name: 'Data Structures & Algorithms', avg: 81.4, faculty: 'Dr. Priya Sharma', passRate: 96.8, topScore: 96 },
  { name: 'Database Management Systems', avg: 78.5, faculty: 'Dr. Rajesh Kumar', passRate: 94.2, topScore: 94 },
  { name: 'Operating Systems', avg: 72.8, faculty: 'Dr. Arun Patel', passRate: 88.5, topScore: 90 },
  { name: 'Computer Networks', avg: 69.4, faculty: 'Dr. Ravi Chandran', passRate: 82.1, topScore: 88 },
  { name: 'Artificial Intelligence & ML', avg: 84.6, faculty: 'Dr. Meena Krishnan', passRate: 98.4, topScore: 98 },
];

export const StaffAcademics: React.FC = () => {
  const [marksList, setMarksList] = useState<AcademicMarkEntry[]>(staffAcademicMarks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedAssessment, setSelectedAssessment] = useState('All');

  // Full Details Modal State
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StaffStudentSummary | null>(null);

  // Modal State for Add / Update Marks
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMarkId, setEditingMarkId] = useState<string | null>(null);
  const [formStudentName, setFormStudentName] = useState('Arun Kumar');
  const [formRollNumber, setFormRollNumber] = useState('21CS001');
  const [formSubject, setFormSubject] = useState('Data Structures');
  const [formAssessment, setFormAssessment] = useState<'Internal 1' | 'Internal 2' | 'Assignment' | 'Model Exam'>('Internal 1');
  const [formMarks, setFormMarks] = useState<number>(44);
  const [formMaxMarks, setFormMaxMarks] = useState<number>(50);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredMarks = marksList.filter((m) => {
    const matchSearch =
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubj = selectedSubject === 'All' || m.subject.includes(selectedSubject);
    const matchAssessment = selectedAssessment === 'All' || m.assessmentType === selectedAssessment;
    return matchSearch && matchSubj && matchAssessment;
  });

  const handleOpenStudentDetails = (studentNameOrRoll: string) => {
    const found = staffStudentsList.find(
      (s) =>
        s.name.toLowerCase() === studentNameOrRoll.toLowerCase() ||
        s.rollNumber.toLowerCase() === studentNameOrRoll.toLowerCase()
    );
    if (found) {
      setSelectedStudentForModal(found);
    } else {
      // Fallback first student
      setSelectedStudentForModal(staffStudentsList[0]);
    }
  };

  const handleOpenAdd = () => {
    setEditingMarkId(null);
    setFormStudentName('Rahul Kumar');
    setFormRollNumber('21CS045');
    setFormSubject('Data Structures');
    setFormAssessment('Internal 1');
    setFormMarks(28);
    setFormMaxMarks(50);
    setModalOpen(true);
  };

  const handleOpenEdit = (entry: AcademicMarkEntry) => {
    setEditingMarkId(entry.id);
    setFormStudentName(entry.studentName);
    setFormRollNumber(entry.rollNumber);
    setFormSubject(entry.subject);
    setFormAssessment(entry.assessmentType as any);
    setFormMarks(entry.marks);
    setFormMaxMarks(entry.maxMarks);
    setModalOpen(true);
  };

  const calculateGrade = (marks: number, maxMarks: number) => {
    const pct = (marks / maxMarks) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 50) return 'B';
    return 'C';
  };

  const handleSaveMark = (e: React.FormEvent) => {
    e.preventDefault();
    const grade = calculateGrade(formMarks, formMaxMarks);

    if (editingMarkId) {
      setMarksList((prev) =>
        prev.map((item) =>
          item.id === editingMarkId
            ? {
                ...item,
                studentName: formStudentName,
                rollNumber: formRollNumber,
                subject: formSubject,
                assessmentType: formAssessment,
                marks: formMarks,
                maxMarks: formMaxMarks,
                grade,
              }
            : item
        )
      );
      setToastMessage(`Marks updated for ${formStudentName} (${formRollNumber})`);
    } else {
      const newEntry: AcademicMarkEntry = {
        id: 'M_' + Date.now(),
        studentId: 'STU_' + Date.now(),
        studentName: formStudentName,
        rollNumber: formRollNumber,
        subject: formSubject,
        assessmentType: formAssessment,
        marks: formMarks,
        maxMarks: formMaxMarks,
        grade,
        date: new Date().toISOString().split('T')[0],
      };
      setMarksList((prev) => [newEntry, ...prev]);
      setToastMessage(`New marks record added for ${formStudentName}`);
    }

    setModalOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <BookOpen size={22} className="text-indigo-600" />
              Academic Performance & Marks Entry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Staff Cohort: {staffCohortOverview.totalStudents} / {staffCohortOverview.maxCohortCapacity} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track assessment marks, view class averages, and inspect any student's full academic & attendance profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Quick Student Profile Inspector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <select
              aria-label="Inspect Student Profile"
              onChange={(e) => {
                if (e.target.value) {
                  handleOpenStudentDetails(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-2.5 py-1.5 text-xs bg-white text-slate-700 font-bold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="" disabled>
                🔍 Inspect Student Profile ({staffStudentsList.length} Cohort Students)...
              </option>
              {staffStudentsList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.rollNumber}) — CGPA {st.cgpa}
                </option>
              ))}
            </select>
          </div>

          <Button variant="primary" size="md" onClick={handleOpenAdd} className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add / Update Marks</span>
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold"
        >
          <Check size={16} className="text-emerald-600" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Cohort Size"
          value={`${staffCohortOverview.totalStudents} Students`}
          subtitle={`Faculty Capacity (${staffCohortOverview.totalStudents}/${staffCohortOverview.maxCohortCapacity})`}
          icon={<Users size={18} />}
          trend="20 Limit"
          trendPositive
        />
        <StatCard
          title="Cohort Academic Average"
          value={`${staffCohortOverview.avgAcademicScore}%`}
          subtitle="Class score average"
          icon={<GraduationCap size={18} />}
          trend="Healthy"
          trendPositive
        />
        <StatCard
          title="Top Performer Score"
          value="98.0%"
          subtitle="Priya Sharma (21AD045)"
          icon={<Award size={18} />}
          trend="Grade O"
          trendPositive
        />
        <StatCard
          title="Students with Low Marks"
          value="4"
          subtitle="Scores below 60%"
          icon={<AlertCircle size={18} />}
          trend="Remedial Assigned"
          trendPositive={false}
        />
      </div>

      {/* Subject-Wise Performance Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-600" />
          Subject-Wise Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectAnalytics.map((subj) => (
            <div key={subj.name} className="card p-5 space-y-3.5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{subj.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{subj.faculty}</p>
                </div>
                <Badge variant={subj.avg >= 75 ? 'brand' : 'warning'}>Avg: {subj.avg}%</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Pass Percentage</span>
                  <span className="font-bold text-slate-900">{subj.passRate}%</span>
                </div>
                <ProgressBar
                  percentage={subj.passRate}
                  color={subj.passRate >= 90 ? '#10B981' : '#F59E0B'}
                  height={6}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Top Score: <strong className="text-indigo-600">{subj.topScore}/100</strong></span>
                <span className="font-semibold text-slate-600">{staffCohortOverview.totalStudents} Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Marks Table */}
      <div className="card p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Assessment Marks Roster</h3>
            <p className="text-xs text-slate-500">Click student name or 'View Details' to open full academic & attendance profile.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="All">All Subjects</option>
              <option value="Data Structures">Data Structures</option>
              <option value="DBMS">DBMS</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
            </select>

            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="All">All Assessments</option>
              <option value="Internal 1">Internal 1</option>
              <option value="Internal 2">Internal 2</option>
              <option value="Assignment">Assignment</option>
              <option value="Model Exam">Model Exam</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4 text-right">Student Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMarks.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleOpenStudentDetails(entry.studentName)}
                      className="font-bold text-slate-900 hover:text-indigo-600 hover:underline flex items-center gap-1.5 text-left"
                    >
                      <User size={13} className="text-indigo-500" />
                      <span>{entry.studentName}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{entry.rollNumber}</td>
                  <td className="py-3 px-4">{entry.subject}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {entry.assessmentType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {entry.marks} <span className="text-slate-400 font-normal">/ {entry.maxMarks}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        entry.grade === 'O' || entry.grade === 'A+'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.grade === 'A' || entry.grade === 'B+'
                          ? 'bg-indigo-100 text-indigo-800'
                          : entry.grade === 'B'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {entry.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenStudentDetails(entry.studentName)}
                        className="inline-flex items-center gap-1 text-xs py-1 px-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
                      >
                        <Eye size={13} />
                        <span>Full Details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(entry)}
                        className="inline-flex items-center gap-1 text-xs py-1"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMarks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No marks records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Update Marks Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap size={18} className="text-indigo-600" />
                  {editingMarkId ? 'Update Student Marks' : 'Add New Assessment Marks'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveMark} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Cohort Student</label>
                  <select
                    value={formRollNumber}
                    onChange={(e) => {
                      const sel = staffStudentsList.find((s) => s.rollNumber === e.target.value);
                      if (sel) {
                        setFormRollNumber(sel.rollNumber);
                        setFormStudentName(sel.name);
                      }
                    }}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    {staffStudentsList.map((st) => (
                      <option key={st.id} value={st.rollNumber}>
                        {st.name} — {st.rollNumber} ({st.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Data Structures">Data Structures</option>
                      <option value="DBMS">DBMS</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Computer Networks">Computer Networks</option>
                      <option value="AI & ML">AI & ML</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Type</label>
                    <select
                      value={formAssessment}
                      onChange={(e) => setFormAssessment(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Internal 1">Internal 1</option>
                      <option value="Internal 2">Internal 2</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Model Exam">Model Exam</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={formMaxMarks}
                      value={formMarks}
                      onChange={(e) => setFormMarks(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Marks</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formMaxMarks}
                      onChange={(e) => setFormMaxMarks(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
                    <Save size={14} />
                    Save Marks Record
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Full Details Modal */}
      <StudentDetailsModal
        student={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        initialTab="academics"
      />
    </div>
  );
};
