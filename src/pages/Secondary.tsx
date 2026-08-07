import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, BookOpen, Code2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { student, summaryStats } from '../data/studentData';

export const Profile: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto space-y-6"
  >
    <div>
      <h2 className="text-2xl font-bold text-charcoal">My Profile</h2>
      <p className="text-gray-500 text-sm mt-1">Your academic and personal information.</p>
    </div>

    {/* Profile Card */}
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative">
          <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">AK</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-charcoal">{student.name}</h3>
          <p className="text-gray-500 text-sm">{student.department} Engineering · Batch of {student.batch}</p>
          <p className="text-gray-400 text-xs mt-0.5">Roll No: {student.rollNumber} · ID: {student.id}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <Badge variant="brand">5th Semester</Badge>
            <Badge variant="success">CGPA: {student.cgpa}</Badge>
            <Badge variant="info">Online</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm">Edit Profile</Button>
      </div>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { icon: Mail, label: 'Email', value: student.email },
        { icon: Phone, label: 'Phone', value: student.phone },
        { icon: GraduationCap, label: 'Department', value: `${student.department} Engineering` },
        { icon: BookOpen, label: 'Current CGPA', value: `${student.cgpa} / 10.0` },
      ].map(({ icon: Icon, label, value }) => (
        <div key={label} className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon size={16} className="text-brand-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-charcoal">{value}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Stats */}
    <div className="card p-5">
      <h4 className="font-semibold text-charcoal mb-4">Academic Summary</h4>
      <div className="space-y-3">
        <ProgressBar label="Attendance" percentage={92.4} showLabel height={7} />
        <ProgressBar label="Placement Readiness" percentage={78} showLabel height={7} color="#8CAB18" />
        <ProgressBar label="Coding Progress" percentage={72} showLabel height={7} color="#F89F1B" />
      </div>
    </div>
  </motion.div>
);

export const Notifications: React.FC = () => {
  const notifs = [
    { type: 'warning', icon: '⚠️', msg: 'Computer Networks attendance below 75%', time: '2 hours ago' },
    { type: 'success', icon: '✅', msg: 'DSA weekly goal completed! 🎉', time: '5 hours ago' },
    { type: 'calendar', icon: '📅', msg: 'DBMS exam in 3 days — review scheduled', time: '1 day ago' },
    { type: 'info', icon: '💼', msg: 'Resume profile is 90% complete', time: '2 days ago' },
    { type: 'ai', icon: '🤖', msg: 'New AI recommendation available for DSA', time: '3 days ago' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal">Notifications</h2>
        <p className="text-gray-500 text-sm mt-1">Your recent alerts and updates.</p>
      </div>
      <div className="card divide-y divide-gray-50">
        {notifs.map((n, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: '#F9FAF9' }}
            className="flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors"
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-charcoal">{n.msg}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const Settings: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-charcoal">Settings</h2>
      <p className="text-gray-500 text-sm mt-1">Manage your preferences and account settings.</p>
    </div>
    {[
      { title: 'Email Notifications', desc: 'Receive alerts for attendance, exams, and AI recommendations', enabled: true },
      { title: 'Push Notifications', desc: 'Browser push notifications for urgent alerts', enabled: false },
      { title: 'Weekly Report', desc: 'Get a weekly summary of your academic progress', enabled: true },
      { title: 'AI Recommendations', desc: 'Enable personalized AI study recommendations', enabled: true },
    ].map((setting) => (
      <div key={setting.title} className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-charcoal">{setting.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
        </div>
        <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.enabled ? 'bg-brand-500' : 'bg-gray-200'}`}>
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </div>
    ))}
  </motion.div>
);
