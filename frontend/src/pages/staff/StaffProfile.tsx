import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Building,
  KeyRound,
  Edit3,
  Check,
  X,
  ShieldCheck,
  LogOut,
  Save,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const StaffProfile: React.FC = () => {
  const { staffProfile, updateStaffProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Edit Profile Form State
  const [formData, setFormData] = useState({
    name: staffProfile.name,
    email: staffProfile.email,
    phone: staffProfile.phone,
    department: staffProfile.department,
    designation: staffProfile.designation,
    office: staffProfile.office,
  });

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenEdit = () => {
    setFormData({
      name: staffProfile.name,
      email: staffProfile.email,
      phone: staffProfile.phone,
      department: staffProfile.department,
      designation: staffProfile.designation,
      office: staffProfile.office,
    });
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStaffProfile(formData);
    setIsEditing(false);
    setToastMessage('Faculty profile updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setToastMessage('Password updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Faculty Profile & Account Settings</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your faculty institutional credentials, department records, and security preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenEdit} className="flex items-center gap-1.5">
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsPasswordModalOpen(true)} className="flex items-center gap-1.5">
            <KeyRound size={14} />
            <span>Change Password</span>
          </Button>
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

      {/* Main Profile Card */}
      <div className="card p-6 relative overflow-hidden bg-gradient-to-r from-white to-indigo-50/20">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white text-2xl font-bold">{staffProfile.avatarInitials || 'PS'}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-extrabold text-slate-900">{staffProfile.name}</h3>
              <Badge variant="brand">Faculty Account</Badge>
            </div>

            <p className="text-slate-600 text-sm font-semibold mt-1">
              {staffProfile.designation} · {staffProfile.department}
            </p>

            <p className="text-slate-400 text-xs mt-1">
              Staff ID: <span className="font-mono text-slate-700 font-bold">{staffProfile.staffId}</span> · Office:{' '}
              <span className="text-slate-700 font-medium">{staffProfile.office}</span>
            </p>

            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Badge variant="success">Class Advisor: 2026 Batch</Badge>
              <Badge variant="info">Institutional Access Verified</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: 'Email Address', value: staffProfile.email },
          { icon: Phone, label: 'Official Phone', value: staffProfile.phone },
          { icon: GraduationCap, label: 'Department', value: staffProfile.department },
          { icon: ShieldCheck, label: 'Designation & Title', value: staffProfile.designation },
          { icon: Building, label: 'Office Room', value: staffProfile.office },
          { icon: BookOpen, label: 'Faculty Employee ID', value: staffProfile.staffId },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600">
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Assigned Subjects */}
      <div className="card p-5 space-y-3">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-600" />
          Assigned Teaching Courses & Labs
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {staffProfile.subjects.map((subj, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Core Course</span>
              <p className="text-xs font-bold text-slate-900 mt-1">{subj}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Sem 5 · 64 Students</p>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions Box */}
      <div className="card p-5 bg-gradient-to-r from-rose-50/50 to-white border border-rose-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Sign Out of Faculty Session</p>
          <p className="text-xs text-slate-500">Ensure your attendance registers and marks are saved before logging out.</p>
        </div>

        <Button variant="danger" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
          <LogOut size={14} />
          Sign Out
        </Button>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <Edit3 size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Faculty Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Office Location</label>
                    <input
                      type="text"
                      value={formData.office}
                      onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
                    <Save size={14} />
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <KeyRound size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
                    <Save size={14} />
                    Update Password
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
