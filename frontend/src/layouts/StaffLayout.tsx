import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StaffSidebar } from '../components/sidebar/StaffSidebar';
import { StaffTopbar } from '../components/topbar/StaffTopbar';

export const StaffLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <div className="min-h-screen bg-surface">
      {/* Staff Sidebar */}
      <StaffSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content area pushed right by sidebar on desktop */}
      <motion.div
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block"
        style={{ minHeight: '100vh' }}
      >
        {/* Staff Top bar */}
        <div className="sticky top-0 z-20">
          <StaffTopbar
            onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
            mobileMenuOpen={mobileMenuOpen}
          />
        </div>
        {/* Page Content */}
        <main className="p-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Mobile: full width */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="sticky top-0 z-20">
          <StaffTopbar
            onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
            mobileMenuOpen={mobileMenuOpen}
          />
        </div>
        <main className="flex-1 p-4 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
