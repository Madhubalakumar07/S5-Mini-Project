import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Edit3,
  Calendar,
  Save,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  initialSupportCases,
  staffReportsList,
} from '../../data/staffData';
import { AIStudentSupportCase, StaffReportSummary } from '../../types';

export const StaffSupportReports: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'support' | 'reports'>('support');
  const [supportCases, setSupportCases] = useState<AIStudentSupportCase[]>(initialSupportCases);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Intervention Modal State
  const [activeCaseForEdit, setActiveCaseForEdit] = useState<AIStudentSupportCase | null>(null);
  const [formRemarks, setFormRemarks] = useState('');
  const [formIntervention, setFormIntervention] = useState('');
  const [formFollowUp, setFormFollowUp] = useState('');
  const [formStatus, setFormStatus] = useState<'Open' | 'In Progress' | 'Resolved' | 'Monitoring'>('In Progress');

  // Report Preview Modal State
  const [previewReport, setPreviewReport] = useState<StaffReportSummary | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredSupportCases = supportCases.filter((c) => {
    if (selectedRiskFilter === 'All') return true;
    return c.riskLevel === selectedRiskFilter;
  });

  const handleOpenIntervention = (c: AIStudentSupportCase) => {
    setActiveCaseForEdit(c);
    setFormRemarks(c.staffRemarks || '');
    setFormIntervention(c.intervention || '1-on-1 Mentoring & Academic Review');
    setFormFollowUp(c.followUpDate || '2026-08-18');
    setFormStatus(c.supportStatus || 'In Progress');
  };

  const handleSaveIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCaseForEdit) return;

    setSupportCases((prev) =>
      prev.map((c) =>
        c.id === activeCaseForEdit.id
          ? {
              ...c,
              staffRemarks: formRemarks,
              intervention: formIntervention,
              followUpDate: formFollowUp,
              supportStatus: formStatus,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );

    setActiveCaseForEdit(null);
    setToastMessage(`Support action plan saved for ${activeCaseForEdit.studentName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadReport = (report: StaffReportSummary) => {
    // Generate simple CSV payload for download
    const csvContent =
      `data:text/csv;charset=utf-8,Report Title,${report.title}\nCategory,${report.category}\nGenerated Date,${report.generatedDate}\nRecords,${report.recordCount}\n` +
      Object.entries(report.summaryMetrics)
        .map(([k, v]) => `${k},${v}`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Downloaded ${report.title} (CSV format)`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Section Switcher */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <HeartHandshake size={22} className="text-indigo-600" />
            AI Student Support & Institutional Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conduct tailored mentoring interventions for at-risk students and generate verified institutional records.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSection('support')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'support'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={14} />
            AI Student Support ({supportCases.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'reports'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={14} />
            Institutional Reports (4)
          </button>
        </div>
      </div>

      {/* Toast Notification */}
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

      {/* ─── SECTION 1: AI STUDENT SUPPORT ──────────────────────────────── */}
      {activeSection === 'support' && (
        <div className="space-y-4">
          {/* Risk Level Filter Badges */}
          <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700">Filter Support Cases by Risk Tier:</span>
            <div className="flex flex-wrap items-center gap-2">
              {(['All', 'High', 'Medium', 'Low'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRiskFilter === r
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r === 'All' ? 'All Risk Levels' : r === 'High' ? '🔴 High Risk' : r === 'Medium' ? '🟠 Medium Risk' : '🟢 Low Risk'}
                </button>
              ))}
            </div>
          </div>

          {/* Support Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSupportCases.map((c) => {
              const isHigh = c.riskLevel === 'High';
              const isMed = c.riskLevel === 'Medium';

              return (
                <div
                  key={c.id}
                  className={`card p-5 space-y-4 border transition-all ${
                    isHigh
                      ? 'border-rose-200 bg-gradient-to-b from-rose-50/30 to-white'
                      : isMed
                      ? 'border-amber-200 bg-gradient-to-b from-amber-50/30 to-white'
                      : 'border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-white'
                  }`}
                >
                  {/* Student Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{c.studentName}</h3>
                      <p className="text-xs text-slate-500">
                        Roll: <span className="font-mono font-semibold">{c.rollNumber}</span> · {c.department}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800'
                          : isMed
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isHigh ? '🔴 High Risk' : isMed ? '🟠 Medium Risk' : '🟢 Low Risk'}
                    </span>
                  </div>

                  {/* Attendance & Academic Score row */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Attendance</span>
                      <span className={`text-sm font-extrabold ${c.attendance < 75 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {c.attendance}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Academic Score</span>
                      <span className={`text-sm font-extrabold ${c.academicScore < 60 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {c.academicScore}%
                      </span>
                    </div>
                  </div>

                  {/* AI Insight & Recommended Action */}
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5 text-indigo-700">
                        <Sparkles size={13} className="text-indigo-600" /> AI Insight:
                      </p>
                      <p className="text-slate-600 leading-relaxed">{c.aiInsight}</p>
                    </div>

                    <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-1">
                      <p className="font-bold text-indigo-900">Recommended Action:</p>
                      <p className="text-indigo-800 leading-relaxed font-medium">{c.recommendedAction}</p>
                    </div>
                  </div>

                  {/* Staff Recorded Remarks / Interventions */}
                  {c.staffRemarks && (
                    <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Staff Intervention Record:</span>
                        <span className="text-[10px] text-slate-400">Updated: {c.lastUpdated}</span>
                      </div>
                      <p className="text-slate-700">{c.staffRemarks}</p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
                        <span>Action: {c.intervention}</span>
                        {c.followUpDate && <span>Follow-up: {c.followUpDate}</span>}
                      </div>
                    </div>
                  )}

                  {/* Action & Status Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      Status:{' '}
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {c.supportStatus}
                      </span>
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenIntervention(c)}
                      className="inline-flex items-center gap-1.5 text-xs"
                    >
                      <Edit3 size={13} />
                      <span>{c.staffRemarks ? 'Update Intervention' : 'Add Remarks & Action'}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SECTION 2: REPORTS ─────────────────────────────────────────── */}
      {activeSection === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffReportsList.map((rep) => (
              <div key={rep.id} className="card p-5 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {rep.category} Report
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">{rep.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.description}</p>
                  </div>
                </div>

                {/* Summary Metrics Chips */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
                  {Object.entries(rep.summaryMetrics).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-[10px] text-slate-400 block">{k}</span>
                      <span className="font-bold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Generated: {rep.generatedDate}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewReport(rep)}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Eye size={13} />
                      Preview
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownloadReport(rep)}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intervention Modal */}
      <AnimatePresence>
        {activeCaseForEdit && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add Staff Remarks & Intervention</h3>
                  <p className="text-xs text-slate-500">Student: {activeCaseForEdit.studentName} ({activeCaseForEdit.rollNumber})</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCaseForEdit(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveIntervention} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Remarks / Counseling Notes</label>
                  <textarea
                    rows={3}
                    required
                    value={formRemarks}
                    onChange={(e) => setFormRemarks(e.target.value)}
                    placeholder="Enter observations, student explanation, or counseling feedback..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Intervention</label>
                  <select
                    value={formIntervention}
                    onChange={(e) => setFormIntervention(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="1-on-1 Academic Mentoring">1-on-1 Academic Mentoring</option>
                    <option value="Remedial Classes & Assignments">Remedial Classes & Assignments</option>
                    <option value="Parent Notification & Counseling">Parent Notification & Counseling</option>
                    <option value="Soft Skills & Mock Interview Session">Soft Skills & Mock Interview Session</option>
                    <option value="Attendance Strict Monitoring">Attendance Strict Monitoring</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Target Date</label>
                    <input
                      type="date"
                      required
                      value={formFollowUp}
                      onChange={(e) => setFormFollowUp(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Support Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Monitoring">Monitoring</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setActiveCaseForEdit(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
                    <Save size={14} />
                    Save Action Plan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {previewReport && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{previewReport.title}</h3>
                    <p className="text-xs text-slate-400">Generated: {previewReport.generatedDate}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewReport(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">{previewReport.description}</p>

                <div className="card p-4 space-y-2 bg-slate-50">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Key Metrics Summary</h4>
                  <div className="divide-y divide-slate-200/60">
                    {Object.entries(previewReport.summaryMetrics).map(([k, v]) => (
                      <div key={k} className="py-1.5 flex justify-between">
                        <span className="text-slate-500">{k}</span>
                        <span className="font-bold text-slate-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-slate-100 mt-5">
                <Button variant="outline" size="sm" onClick={() => setPreviewReport(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleDownloadReport(previewReport);
                    setPreviewReport(null);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Download CSV
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
