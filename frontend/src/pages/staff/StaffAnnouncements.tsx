import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone,
  PlusCircle,
  Pin,
  Calendar,
  Users,
  Edit2,
  Trash2,
  X,
  Save,
  Check,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { initialAnnouncements } from '../../data/staffData';
import { Announcement } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const StaffAnnouncements: React.FC = () => {
  const { staffProfile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAudience, setFormAudience] = useState<Announcement['audience']>('All Students');
  const [formCategory, setFormCategory] = useState<Announcement['category']>('General');
  const [formPinned, setFormPinned] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormAudience('All Students');
    setFormCategory('General');
    setFormPinned(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setFormTitle(ann.title);
    setFormDescription(ann.description);
    setFormAudience(ann.audience);
    setFormCategory(ann.category);
    setFormPinned(!!ann.pinned);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setToastMessage('Announcement deleted successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                title: formTitle,
                description: formDescription,
                audience: formAudience,
                category: formCategory,
                pinned: formPinned,
              }
            : a
        )
      );
      setToastMessage('Announcement updated successfully.');
    } else {
      const newAnn: Announcement = {
        id: 'ANN_' + Date.now(),
        title: formTitle,
        description: formDescription,
        audience: formAudience,
        category: formCategory,
        pinned: formPinned,
        date: new Date().toISOString().split('T')[0],
        author: staffProfile.name,
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      setToastMessage('Announcement published to students!');
    }

    setModalOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Megaphone size={22} className="text-indigo-600" />
            Staff Announcement Management Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast official examination notices, campus placement alerts, and departmental bulletins to students.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenCreate} className="flex items-center gap-2 self-start sm:self-auto">
          <PlusCircle size={16} />
          <span>Create Announcement</span>
        </Button>
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

      {/* Announcements List */}
      <div className="space-y-3.5">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`card p-5 transition-all hover:shadow-md ${
              ann.pinned ? 'border-indigo-200 bg-gradient-to-r from-indigo-50/30 to-white' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                      <Pin size={10} /> PINNED
                    </span>
                  )}
                  <Badge
                    variant={
                      ann.category === 'Exam'
                        ? 'warning'
                        : ann.category === 'Placement'
                        ? 'success'
                        : ann.category === 'Attendance'
                        ? 'danger'
                        : 'brand'
                    }
                  >
                    {ann.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    <Users size={12} /> {ann.audience}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">{ann.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-start flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(ann)}
                  className="text-xs p-1.5 text-slate-600 hover:text-indigo-600"
                >
                  <Edit2 size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(ann.id)}
                  className="text-xs p-1.5 text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Author: <strong className="text-slate-600">{ann.author}</strong></span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> Published on {ann.date}
              </span>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="card p-12 text-center text-slate-400">
            <Megaphone size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">No announcements published yet.</p>
            <p className="text-xs mt-1">Click "Create Announcement" to broadcast to students.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
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
                  <Megaphone size={18} className="text-indigo-600" />
                  {editingId ? 'Edit Announcement' : 'Publish New Announcement'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Announcement Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Model Examination Schedule - Semester 5"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter complete announcement content, instructions, or deadlines..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                    <select
                      value={formAudience}
                      onChange={(e) => setFormAudience(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="All Students">All Students</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="General">General Notice</option>
                      <option value="Exam">Exam & Academics</option>
                      <option value="Placement">Placement & Drives</option>
                      <option value="Attendance">Attendance Warning</option>
                      <option value="Event">Department Event</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPinned}
                      onChange={(e) => setFormPinned(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    Pin announcement to top of student feed
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
                    <Save size={14} />
                    {editingId ? 'Update Notice' : 'Publish Notice'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
