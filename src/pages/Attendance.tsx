import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  CalendarCheck, Users, XCircle, Flame, Camera, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { Modal } from '../components/ui/Modal';
import { attendanceTrend, subjectAttendance, calendarData } from '../data/attendanceData';
import type { CalendarDay } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusColor = {
  Excellent: 'success',
  Good: 'brand',
  'At Risk': 'warning',
  Critical: 'danger',
} as const;

const calendarStatusStyle = {
  present: 'bg-emerald-500 text-white',
  absent: 'bg-red-400 text-white',
  partial: 'bg-amber-400 text-white',
  holiday: 'bg-gray-100 text-gray-400',
  future: 'text-gray-300 hover:bg-gray-50',
};

// Calendar starts on Thursday (Aug 1, 2026)
const FIRST_DAY_OFFSET = 4; // Thursday = index 4 (Sun=0)

export const Attendance: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDayClick = (day: CalendarDay) => {
    if (day.status === 'holiday' || day.status === 'future') return;
    setSelectedDay(day);
    setModalOpen(true);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-charcoal">Attendance</h2>
        <p className="text-gray-500 text-sm mt-1">Track your attendance and identify subjects that need attention.</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Attendance" value="92.4%" subtitle="Current semester" icon={<CalendarCheck size={18} />} trend="+2.1% this month" />
        <StatCard title="Classes Attended" value="186" subtitle="Out of 201 total" icon={<Users size={18} />} />
        <StatCard title="Classes Missed" value="15" subtitle="3 this month" icon={<XCircle size={18} />} trendPositive={false} />
        <StatCard title="Current Streak" value="12 days" subtitle="Keep it up!" icon={<Flame size={18} />}>
          <div className="flex items-center gap-1 mt-1">
            <Flame size={12} className="text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">On a roll!</span>
          </div>
        </StatCard>
      </motion.div>

      {/* Attendance Trend Chart */}
      <motion.div variants={item}>
        <ChartCard title="Attendance Trend" subtitle="Last 8 weeks — threshold at 75%">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="attendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006747" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#006747" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                  formatter={(v) => [`${v}%`, 'Attendance']}
                />
                <ReferenceLine
                  y={75}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: '75% min', position: 'right', fontSize: 10, fill: '#EF4444' }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#006747"
                  strokeWidth={2.5}
                  fill="url(#attendGradient)"
                  dot={{ r: 3, fill: '#006747' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </motion.div>

      {/* Subject Attendance Table */}
      <motion.div variants={item} className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-charcoal">Subject-wise Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Subject</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Faculty</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Attended</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">%</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subjectAttendance.map((row) => (
                <motion.tr
                  key={row.subject}
                  whileHover={{ backgroundColor: '#F9FAF9' }}
                  className="transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-charcoal">{row.subject}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{row.faculty}</td>
                  <td className="px-5 py-3.5 text-gray-600">
                    <span className="font-medium">{row.attended}</span>
                    <span className="text-gray-400"> / {row.total}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-semibold ${
                        row.percentage < 75 ? 'text-red-600' : row.percentage >= 90 ? 'text-emerald-600' : 'text-charcoal'
                      }`}
                    >
                      {row.percentage}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusColor[row.status]}>{row.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Calendar + Smart Attendance */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">August 2026</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />Present</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" />Absent</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />Partial</span>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: FIRST_DAY_OFFSET }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {calendarData.map((day) => {
              const style = calendarStatusStyle[day.status];
              return (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day)}
                  disabled={day.status === 'holiday' || day.status === 'future'}
                  className={`aspect-square w-full flex items-center justify-center text-xs font-medium rounded-lg transition-all ${style} ${
                    day.status !== 'holiday' && day.status !== 'future' ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
                  } ${day.date === 7 ? 'ring-2 ring-brand-400 ring-offset-1' : ''}`}
                  aria-label={`August ${day.date}, ${day.status}`}
                >
                  {day.date}
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Attendance + Alert */}
        <div className="space-y-4">
          {/* Smart Attendance Card */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <Camera size={20} className="text-brand-500" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal text-sm">Smart Attendance</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-600 font-medium">Face recognition active</span>
                </div>
              </div>
            </div>
            <div className="bg-brand-50 rounded-xl p-3 mb-3">
              <div className="w-full h-20 bg-brand-100 rounded-lg flex items-center justify-center">
                <Camera size={24} className="text-brand-400" />
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full">
              View Attendance Verification
            </Button>
          </div>

          {/* Alert */}
          <div className="card p-4 border-l-4 border-amber-400">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-1">Attendance Alert</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your Computer Networks attendance is <span className="font-semibold text-red-600">72.4%</span>. 
                  Attend next 2 classes to return above the threshold.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  View Recovery Plan <ChevronRight size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Day Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDay ? `August ${selectedDay.date}, 2026` : ''}
      >
        {selectedDay && selectedDay.classes && (
          <div className="space-y-3">
            {selectedDay.classes.map((cls, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  cls.status === 'Present' ? 'bg-emerald-500' : 'bg-red-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-charcoal">{cls.subject}</p>
                  <p className="text-xs text-gray-500">{cls.time}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={cls.status === 'Present' ? 'success' : 'danger'} size="sm">
                      {cls.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{cls.recognitionMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedDay && !selectedDay.classes && (
          <p className="text-sm text-gray-500">No class records for this day.</p>
        )}
      </Modal>
    </motion.div>
  );
};
