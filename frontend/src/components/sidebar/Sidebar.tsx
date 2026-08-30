import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Briefcase,
  User,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const mainNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
  { label: 'Academics', path: '/academics', icon: BookOpen },
  { label: 'Placement', path: '/placement', icon: Briefcase },
];

const secondaryNav = [
  { label: 'My Profile', path: '/profile', icon: User },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, logout } = useAuth();

  const handleLogout = () => {
    onMobileClose();
    logout();
    navigate('/login', { replace: true });
  };

  const NavItem = ({
    item,
    collapsed: isCollapsed,
  }: {
    item: { label: string; path: string; icon: React.ElementType };
    collapsed: boolean;
  }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    return (
      <NavLink
        to={item.path}
        onClick={onMobileClose}
        className={({ isActive: active }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
            active
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'
          }`
        }
        title={isCollapsed ? item.label : undefined}
      >
        <Icon
          size={18}
          className={`flex-shrink-0 transition-colors ${
            isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-500'
          }`}
        />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-charcoal text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </div>
        )}
      </NavLink>
    );
  };

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles size={16} className="text-white" />
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
              <p className="text-sm font-bold text-charcoal whitespace-nowrap">CampusAI</p>
              <p className="text-xs text-gray-400 whitespace-nowrap">Student Support</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <NavItem key={item.path} item={item} collapsed={isCollapsed} />
        ))}

        {/* Divider */}
        <div className={`my-4 ${isCollapsed ? 'mx-2' : 'mx-0'}`}>
          <div className="h-px bg-gray-100" />
        </div>

        {/* Secondary Nav */}
        {secondaryNav.map((item) => (
          <NavItem key={item.path} item={item} collapsed={isCollapsed} />
        ))}
      </nav>

      {/* Profile Card & Logout */}
      <div className="p-3 border-t border-gray-100">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-2.5 bg-brand-50/70 rounded-2xl border border-brand-100/80 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {student.avatarInitials || 'ST'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-charcoal truncate">{student.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {student.department} · {student.batch}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mb-2 flex justify-center">
              <div className="relative">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {student.avatarInitials || 'ST'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            </div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <LogOut size={16} className="text-red-500 flex-shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
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
            className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl lg:hidden"
          >
            <SidebarContent isCollapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-white border-r border-gray-100 z-30 overflow-hidden"
      >
        <SidebarContent isCollapsed={collapsed} />

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-gray-400 hover:text-gray-600"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>
    </>
  );
};
