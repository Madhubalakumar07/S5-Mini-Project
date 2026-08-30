import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Hash,
  Calendar,
  Edit3,
  Check,
  X,
  Shield,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { student, updateStudentProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: student.name,
    phone: student.phone,
    department: student.department,
    rollNumber: student.rollNumber,
    batch: student.batch,
    cgpa: student.cgpa,
  });

  const handleOpenEdit = () => {
    setFormData({
      name: student.name,
      phone: student.phone,
      department: student.department,
      rollNumber: student.rollNumber,
      batch: student.batch,
      cgpa: student.cgpa,
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(formData);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">My Profile</h2>
          <p className="text-gray-500 text-sm mt-1">Your academic and personal institutional records.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenEdit}
          className="flex items-center gap-1.5"
        >
          <Edit3 size={14} />
          <span>Edit Profile</span>
        </Button>
      </div>

      {/* Profile Card */}
      <div className="card p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-bold">{student.avatarInitials || 'ST'}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h3 className="text-xl font-bold text-charcoal">{student.name}</h3>
            <p className="text-gray-500 text-sm mt-0.5">
              {student.department} · Batch of {student.batch}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Roll No: <span className="font-mono text-gray-600">{student.rollNumber}</span> · Student ID:{' '}
              <span className="font-mono text-gray-600">{student.id}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Badge variant="brand">5th Semester</Badge>
              <Badge variant="success">CGPA: {student.cgpa}</Badge>
              <Badge variant="info">Institutional Account Active</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: 'Email Address', value: student.email },
          { icon: Phone, label: 'Contact Phone', value: student.phone },
          { icon: GraduationCap, label: 'Department / Major', value: student.department },
          { icon: Hash, label: 'Roll / Register Number', value: student.rollNumber },
          { icon: Calendar, label: 'Graduation Batch', value: `Class of ${student.batch}` },
          { icon: BookOpen, label: 'Current CGPA', value: `${student.cgpa} / 10.0` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-600">
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-charcoal truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Academic Summary */}
      <div className="card p-5">
        <h4 className="font-semibold text-charcoal mb-4">Academic Summary</h4>
        <div className="space-y-3.5">
          <ProgressBar label="Overall Attendance" percentage={92.4} showLabel height={7} />
          <ProgressBar label="Placement Readiness" percentage={78} showLabel height={7} color="#8CAB18" />
          <ProgressBar label="Coding Practice Progress" percentage={72} showLabel height={7} color="#F89F1B" />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                    <Edit3 size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">Edit Profile Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      max="10"
                      min="0"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Batch Year</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 mt-5">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
                    <Check size={14} />
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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

export const Settings: React.FC = () => {
  const { user, student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences.</p>
      </div>

      {/* Account Info Box */}
      <div className="card p-5 bg-gradient-to-r from-brand-50/60 to-white border border-brand-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-brand-500 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm">
            {student.avatarInitials || 'ST'}
          </div>
          <div>
            <p className="text-sm font-bold text-charcoal">{student.name}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
            <p className="text-[11px] text-brand-600 font-medium mt-0.5">Role: {user?.role || 'student'}</p>
          </div>
        </div>

        <Button variant="danger" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
          <LogOut size={14} />
          Sign Out
        </Button>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
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
            <div
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                setting.enabled ? 'bg-brand-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  setting.enabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
