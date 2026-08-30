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
  Info,
  Sparkles,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  ChevronDown,
} from 'lucide-react';
import { notifications } from '../../data/studentData';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

const pageInfo: Record<string, { title: string; breadcrumb: string[] }> = {
  '/dashboard': { title: 'Dashboard', breadcrumb: ['Home', 'Dashboard'] },
  '/attendance': { title: 'Attendance', breadcrumb: ['Home', 'Attendance'] },
  '/academics': { title: 'Academic Analytics', breadcrumb: ['Home', 'Academics'] },
  '/placement': { title: 'Placement Readiness', breadcrumb: ['Home', 'Placement'] },
  '/profile': { title: 'My Profile', breadcrumb: ['Home', 'Profile'] },
  '/notifications': { title: 'Notifications', breadcrumb: ['Home', 'Notifications'] },
  '/settings': { title: 'Settings', breadcrumb: ['Home', 'Settings'] },
};

const notifIcons = {
  warning: <AlertTriangle size={14} className="text-amber-500" />,
  success: <CheckCircle size={14} className="text-emerald-500" />,
  info: <Info size={14} className="text-blue-500" />,
  calendar: <Calendar size={14} className="text-purple-500" />,
  ai: <Sparkles size={14} className="text-brand-500" />,
};

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifList, setNotifList] = useState(notifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const page = pageInfo[location.pathname] || { title: 'CampusAI', breadcrumb: ['Home'] };
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
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 gap-4">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-charcoal truncate">{page.title}</h1>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            {page.breadcrumb.map((crumb, i) => (
              <React.Fragment key={crumb}>
                {i > 0 && <span>/</span>}
                <span className={i === page.breadcrumb.length - 1 ? 'text-brand-500 font-medium' : ''}>{crumb}</span>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
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
                placeholder="Search subjects, topics, stats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </motion.div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-charcoal">Notifications</span>
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-brand-500 font-medium hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifList.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                        !n.read ? 'bg-brand-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">{notifIcons[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${!n.read ? 'font-medium text-charcoal' : 'text-gray-600'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-1.5 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative pl-1" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-gray-100 transition-colors group text-left"
          >
            <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-brand-100 group-hover:ring-brand-300 transition-all">
              {student.avatarInitials || 'ST'}
            </div>
            <div className="hidden md:block leading-tight">
              <span className="text-xs font-semibold text-charcoal block truncate max-w-[120px]">
                {student.name}
              </span>
              <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">
                {student.department || 'Student'}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 p-2"
              >
                <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-xs font-bold text-charcoal truncate">{student.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{student.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-brand-50 text-brand-600 px-2 py-0.5 rounded-md">
                    Roll: {student.rollNumber}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserIcon size={15} className="text-gray-400" />
                  My Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <SettingsIcon size={15} className="text-gray-400" />
                  Account Settings
                </Link>

                <div className="h-px bg-gray-100 my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={15} className="text-red-500" />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
