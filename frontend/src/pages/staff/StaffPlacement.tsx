import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Building2,
  Award,
  DollarSign,
  Eye,
  User,
  ExternalLink,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  staffPlacementRoster,
  staffCohortOverview,
  staffStudentsList,
} from '../../data/staffData';
import { StaffStudentSummary, StaffPlacementStudent } from '../../types';
import { StudentDetailsModal } from '../../components/staff/StudentDetailsModal';

const placementDrives = [
  { company: 'Zoho Corporation', role: 'Software Developer', ctc: '5.50 LPA', date: 'Aug 02, 2026', applied: 18, selected: 5, status: 'Completed', color: 'bg-red-500' },
  { company: 'Accenture India', role: 'Associate Software Eng.', ctc: '6.50 LPA', date: 'Jul 28, 2026', applied: 19, selected: 4, status: 'Completed', color: 'bg-purple-600' },
  { company: 'Tata Consultancy Services', role: 'System Engineer', ctc: '3.80 LPA', date: 'Jul 20, 2026', applied: 20, selected: 4, status: 'Completed', color: 'bg-blue-600' },
  { company: 'Infosys Limited', role: 'Specialist Programmer', ctc: '4.50 LPA', date: 'Aug 20, 2026', applied: 16, selected: 0, status: 'Upcoming Drive', color: 'bg-sky-600' },
];

export const StaffPlacement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEligibility, setSelectedEligibility] = useState('All');

  // Full Details Modal State
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StaffStudentSummary | null>(null);

  const filteredPlacementStudents = staffPlacementRoster.filter((st) => {
    const matchSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = selectedStatus === 'All' || st.placementStatus === selectedStatus;
    const matchEligibility = selectedEligibility === 'All' || st.eligibility === selectedEligibility;
    return matchSearch && matchStatus && matchEligibility;
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
      setSelectedStudentForModal(staffStudentsList[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Briefcase size={22} className="text-indigo-600" />
              Campus Placement Analytics & Student Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Staff Cohort: {staffCohortOverview.totalStudents} / {staffCohortOverview.maxCohortCapacity} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track student placement eligibility, application pipelines, and view any specific student's full profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Quick Student Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <select
              aria-label="Inspect Student Placement Details"
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
                🔍 Inspect Student Placement Details ({staffStudentsList.length} Cohort Students)...
              </option>
              {staffStudentsList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.rollNumber}) — {st.placementStatus || 'Seeking'} {st.company ? `(${st.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          <Badge variant="success">Placement Season 2025–26</Badge>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Cohort Students"
          value={staffCohortOverview.totalStudents}
          subtitle={`Capacity (${staffCohortOverview.totalStudents}/${staffCohortOverview.maxCohortCapacity})`}
          icon={<Users size={18} />}
          trend="20 Limit"
          trendPositive
        />
        <StatCard
          title="Placement Eligible"
          value={staffCohortOverview.eligibleForPlacement}
          subtitle="CGPA ≥ 7.0, 0 backlogs"
          icon={<CheckCircle2 size={18} />}
          trend="80.0%"
          trendPositive
        />
        <StatCard
          title="Placed Offers"
          value={staffCohortOverview.totalPlaced}
          subtitle="Confirmed Offers"
          icon={<Award size={18} />}
          trend="13 Selected"
          trendPositive
        />
        <StatCard
          title="Placement Rate"
          value={`${staffCohortOverview.placementRate}%`}
          subtitle="Eligible placed ratio"
          icon={<DollarSign size={18} />}
          trend="Top Tier"
          trendPositive
        />
        <StatCard
          title="In Process"
          value="3"
          subtitle="Interviews scheduled"
          icon={<Building2 size={18} />}
          trend="Round 2"
          trendPositive
        />
        <StatCard
          title="Highest Package"
          value="6.5 LPA"
          subtitle="Accenture / Zoho"
          icon={<TrendingUp size={18} />}
          trend="Dream Tier"
          trendPositive
        />
      </div>

      {/* Recruiting Drives Summary */}
      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Building2 size={16} className="text-indigo-600" />
          Campus Recruitment Drives Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {placementDrives.map((drive) => (
            <div key={drive.company} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{drive.company}</h3>
                  <p className="text-[11px] text-slate-500">{drive.role}</p>
                </div>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  {drive.ctc}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Selected / Applied</span>
                  <span className="font-bold text-slate-900">
                    {drive.selected} / {drive.applied}
                  </span>
                </div>
                <ProgressBar
                  percentage={drive.applied > 0 ? (drive.selected / drive.applied) * 100 : 0}
                  color="#6366F1"
                  height={5}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                <span>{drive.date}</span>
                <Badge variant={drive.status === 'Completed' ? 'success' : 'brand'}>{drive.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Placement Table */}
      <div className="card p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Cohort Student Placement Records</h3>
            <p className="text-xs text-slate-500">Click any student name or 'Full Details' to view their comprehensive academic & placement portfolio.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, roll, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedEligibility}
              onChange={(e) => setSelectedEligibility(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="All">All Eligibility</option>
              <option value="Eligible">Eligible</option>
              <option value="Conditionally Eligible">Conditionally Eligible</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed</option>
              <option value="In Process">In Process</option>
              <option value="Seeking">Seeking</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Register No</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Key Skills</th>
                <th className="py-3 px-4">Eligibility</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-4">Company & Package</th>
                <th className="py-3 px-4 text-right">Student Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPlacementStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleOpenStudentDetails(st.name)}
                      className="font-bold text-slate-900 hover:text-indigo-600 hover:underline flex items-center gap-1.5 text-left"
                    >
                      <User size={13} className="text-indigo-500" />
                      <span>{st.name}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{st.rollNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{st.cgpa}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {st.skills.map((sk) => (
                        <span key={sk} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.eligibility === 'Eligible'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : st.eligibility === 'Conditionally Eligible'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {st.eligibility}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        st.placementStatus === 'Placed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.placementStatus === 'In Process'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {st.placementStatus === 'Placed' ? '✓ Placed' : st.placementStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {st.company ? (
                      <div>
                        <span className="font-bold text-slate-900">{st.company}</span>
                        {st.ctc && <span className="text-xs text-indigo-600 font-bold ml-1.5">({st.ctc})</span>}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenStudentDetails(st.name)}
                      className="inline-flex items-center gap-1 text-xs py-1 px-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
                    >
                      <Eye size={13} />
                      <span>Full Details</span>
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredPlacementStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No student placement records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Full Details Modal */}
      <StudentDetailsModal
        student={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        initialTab="placement"
      />
    </div>
  );
};
