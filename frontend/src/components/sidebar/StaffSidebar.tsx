import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  HeartHandshake,
  Megaphone,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StaffSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const staffNavItems = [
  { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
  { label: 'Students & Attendance', path: '/staff/students-attendance', icon: Users },
  { label: 'Academics', path: '/staff/academics', icon: BookOpen },
  { label: 'Placement', path: '/staff/placement', icon: Briefcase },
  { label: 'Support & Reports', path: '/staff/support-reports', icon: HeartHandshake },
  { label: 'Announcements', path: '/staff/announcements', icon: Megaphone },
  { label: 'Profile / Settings', path: '/staff/profile', icon: UserCheck },
];

export const StaffSidebar: React.FC<StaffSidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staffProfile, logout } = useAuth();

  const handleLogout = () => {
    onMobileClose();
    logout();
    navigate('/login', { replace: true });
  };

  const NavItem = ({
    item,
    collapsed: isCollapsed,
  }: {
    item: (typeof staffNavItems)[0];
    collapsed: boolean;
  }) => {
    const isActive = location.pathname === item.path || (item.path === '/staff/dashboard' && location.pathname === '/staff');
    const Icon = item.icon;
    return (
      <NavLink
        to={item.path}
        onClick={onMobileClose}
        className={
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative ${
            isActive
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600'
          }`
        }
        title={isCollapsed ? item.label : undefined}
      >
        <Icon
          size={18}
          className={`flex-shrink-0 transition-colors ${
            isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
          }`}
        />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap text-xs font-bold"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg font-medium">
            {item.label}
          </div>
        )}
      </NavLink>
    );
  };

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo & Portal Badge */}
      <div className={`flex items-center gap-3 px-4 py-5 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/25">
          <Sparkles size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1.5">
                <p className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">CampusAI</p>
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                  Staff
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Faculty & Advisor Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {staffNavItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={isCollapsed} />
        ))}
      </nav>

      {/* Staff Profile Card & Logout */}
      <div className="p-3 border-t border-slate-100">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-2.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/80 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {staffProfile.avatarInitials || 'PS'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{staffProfile.name}</p>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <ShieldCheck size={11} className="text-indigo-600" />
                    {staffProfile.staffId}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mb-2 flex justify-center">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {staffProfile.avatarInitials || 'PS'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            </div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <LogOut size={16} className="text-rose-500 flex-shrink-0" />
          {!isCollapsed && <span className="font-semibold">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-100 shadow-xl lg:hidden"
          >
            <SidebarContent isCollapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-white border-r border-slate-100 z-30 overflow-hidden"
      >
        <SidebarContent isCollapsed={collapsed} />

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-slate-400 hover:text-slate-600"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>
    </>
  );
};
