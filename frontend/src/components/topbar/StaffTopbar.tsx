import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Sparkles,
  LogOut,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StaffTopbarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

const staffPageInfo: Record<string, { title: string; breadcrumb: string[] }> = {
  '/staff/dashboard': { title: 'Staff Dashboard', breadcrumb: ['Staff', 'Overview'] },
  '/staff': { title: 'Staff Dashboard', breadcrumb: ['Staff', 'Overview'] },
  '/staff/students-attendance': { title: 'Students & Attendance', breadcrumb: ['Staff', 'Students & Attendance'] },
  '/staff/academics': { title: 'Academic Management', breadcrumb: ['Staff', 'Academics'] },
  '/staff/placement': { title: 'Placement Analytics', breadcrumb: ['Staff', 'Placement'] },
  '/staff/support-reports': { title: 'Support & Reports', breadcrumb: ['Staff', 'Support & Reports'] },
  '/staff/announcements': { title: 'Announcements Hub', breadcrumb: ['Staff', 'Announcements'] },
  '/staff/profile': { title: 'Staff Profile & Settings', breadcrumb: ['Staff', 'Profile & Settings'] },
};

const staffNotifications = [
  {
    id: '1',
    type: 'warning' as const,
    message: '3 students attendance dropped below 75% threshold in Sem 5 CSE.',
    time: '30 mins ago',
    read: false,
  },
  {
    id: '2',
    type: 'ai' as const,
    message: 'AI Risk Engine flagged 1 new student (Rahul Kumar) for academic intervention.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'success' as const,
    message: 'Zoho recruitment drive round 1 shortlist published: 8 students selected.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'calendar' as const,
    message: 'Internal Assessment 2 mark entry deadline is approaching in 4 days.',
    time: '2 days ago',
    read: true,
  },
];

const notifIcons = {
  warning: <AlertTriangle size={14} className="text-amber-500" />,
  success: <CheckCircle size={14} className="text-emerald-500" />,
  calendar: <Calendar size={14} className="text-purple-500" />,
  ai: <Sparkles size={14} className="text-indigo-600" />,
};

export const StaffTopbar: React.FC<StaffTopbarProps> = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staffProfile, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifList, setNotifList] = useState(staffNotifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const page = staffPageInfo[location.pathname] || { title: 'Staff Portal', breadcrumb: ['Staff'] };
  const unread = notifList.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-6 gap-4">
      {/* Left Title & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 truncate">{page.title}</h1>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/60">
              <ShieldCheck size={11} /> Faculty Advisor
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            {page.breadcrumb.map((crumb, i) => (
              <React.Fragment key={crumb}>
                {i > 0 && <span>/</span>}
                <span className={i === page.breadcrumb.length - 1 ? 'text-indigo-600 font-semibold' : ''}>{crumb}</span>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Search */}
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <input
                autoFocus
                type="text"
                placeholder="Search students, roll no, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="w-full px-3.5 py-1.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </motion.div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </button>
          )}
        </AnimatePresence>

        {/* Staff Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200/80 shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sm font-bold text-slate-900">Faculty Alerts</span>
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-indigo-600 font-semibold hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifList.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
                        !n.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">{notifIcons[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Staff User Profile Menu */}
        <div className="relative pl-1" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors group text-left"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all">
              {staffProfile.avatarInitials || 'PS'}
            </div>
            <div className="hidden md:block leading-tight">
              <span className="text-xs font-semibold text-slate-900 block truncate max-w-[130px]">
                {staffProfile.name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                {staffProfile.designation || 'Faculty'}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-slate-200/80 shadow-xl z-50 p-2"
              >
                <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{staffProfile.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{staffProfile.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                    ID: {staffProfile.staffId}
                  </span>
                </div>

                <Link
                  to="/staff/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserCheck size={15} className="text-slate-400" />
                  Staff Profile & Settings
                </Link>

                <Link
                  to="/staff/academics"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <BookOpen size={15} className="text-slate-400" />
                  Assigned Subjects
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut size={15} className="text-rose-500" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
